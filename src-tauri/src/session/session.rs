use crate::session::aescbc::aes_cbc_encrypt;
use crate::session::conwork::encode_inp;
use crate::session::error::SessionError;
use cookie_store::Cookie;
use regex::Regex;
use reqwest::Client;
use reqwest::header::HeaderMap;
use reqwest_cookie_store::{CookieStore, CookieStoreMutex};
use std::collections::HashMap;
use std::fs::File;
use std::sync::Arc;
use tauri::Url;
pub struct HttpSession {
    pub client: Client,
    pub cookie_store: Arc<CookieStoreMutex>,
    pub cookie_path: Option<String>,
}

impl HttpSession {
    pub fn new(cookie_path: Option<&str>) -> Result<Self, SessionError> {
        let cookie_store = if let Some(path) = cookie_path {
            if std::path::Path::new(path).exists() {
                Self::load_cookie_store(path)?
            } else {
                CookieStore::default()
            }
        } else {
            CookieStore::default()
        };

        let shared_store = Arc::new(CookieStoreMutex::new(cookie_store));
        let client = Client::builder()
            .cookie_provider(shared_store.clone())
            .build()
            .map_err(|_| SessionError::Custom("创建HTTP客户端失败".to_string()))?;
        Ok(Self {
            client,
            cookie_store: shared_store.clone(),
            cookie_path: cookie_path.map(|s| s.to_string()),
        })
    }

    fn save_cookie_store(store: &CookieStore, path: &str) -> Result<(), SessionError> {
        let cookies: Vec<Cookie> = store.iter_any().cloned().collect();
        let file =
            File::create(path).map_err(|_| SessionError::Custom("创建cookie文件失败".into()))?;
        serde_json::to_writer_pretty(file, &cookies)
            .map_err(|_| SessionError::Custom("序列化cookie失败".into()))?;
        Ok(())
    }

    pub fn load_cookie_store(path: &str) -> Result<CookieStore, SessionError> {
        let file =
            File::open(path).map_err(|_| SessionError::Custom("打开 cookie 文件失败".into()))?;

        let cookies: Vec<Cookie> = serde_json::from_reader(file)
            .map_err(|_| SessionError::Custom("解析 cookie JSON 失败".into()))?;

        let mut store = CookieStore::default();

        for cookie in cookies {
            let domain = match &cookie.domain {
                cookie_store::CookieDomain::HostOnly(s) => Some(s.as_str()),
                cookie_store::CookieDomain::Suffix(s) => Some(s.as_str()),
                _ => None,
            };

            let domain = domain.unwrap_or("").trim();
            if domain.is_empty() {
                eprintln!("⚠️ 跳过无效域 cookie: {:?}", cookie);
                continue;
            }

            let path = cookie.path().unwrap_or("/");
            let path = if path.starts_with('/') { path } else { "/" };

            let url_str = format!("https://{}{}", domain.trim_start_matches('.'), path);
            let url = match Url::parse(&url_str) {
                Ok(u) => u,
                Err(e) => {
                    eprintln!(
                        "⚠️ 构造 URL 失败: {} ({:?})，跳过 cookie: {:?}",
                        url_str, e, cookie
                    );
                    continue;
                }
            };

            match store.insert(cookie.clone(), &url) {
                Ok(_) => {
                    println!("✅ 已插入 cookie: {:?} -> {}", cookie.name(), url);
                }
                Err(e) => {
                    eprintln!("⚠️ 插入失败，跳过 cookie: {:?} 错误: {:?}", cookie, e);
                }
            }
        }

        Ok(store)
    }

    pub fn save_cookies(&self) -> Result<(), SessionError> {
        if let Some(path) = &self.cookie_path {
            let store = self
                .cookie_store
                .lock()
                .map_err(|_| SessionError::Custom("获取cookie锁失败".into()))?;
            Self::save_cookie_store(&store, path)?;
        }
        Ok(())
    }
}

impl HttpSession {
    pub async fn get_flow_execution_key(&self) -> Result<String, SessionError> {
        let response = self
            .client
            .get("https://oa-443.v.hbfu.edu.cn/backstage/cas/login")
            .send()
            .await?;
        let text = response.text().await?;
        let pattern = Regex::new(r#"flowExecutionKey: "(.*?)""#)?;

        if let Some(captures) = pattern.captures(&text) {
            if let Some(matched) = captures.get(1) {
                Ok(matched.as_str().to_string())
            } else {
                Err(SessionError::PatternNotFound)
            }
        } else {
            Err(SessionError::PatternNotFound)
        }
    }

    async fn login_vpn(
        &self,
        username: &str,
        password: &str,
        flow_execution_key: &str,
    ) -> Result<(), SessionError> {
        let encrypted_password = aes_cbc_encrypt(password)
            .map_err(|_| SessionError::Custom("密码加密失败".to_string()))?;
        let mut form_data = HashMap::new();
        form_data.insert("username", username);
        form_data.insert("password", &encrypted_password);
        form_data.insert("execution", flow_execution_key);
        form_data.insert("_eventId", "submit");
        form_data.insert("rememberMe", "false");
        form_data.insert("domain", "oa-443.v.hbfu.edu.cn");

        self.client
            .post("https://oa-443.v.hbfu.edu.cn/backstage/cas/login")
            .form(&form_data)
            .send()
            .await
            .map_err(|_| SessionError::Custom("登录请求失败".to_string()))?
            .error_for_status()
            .map_err(|_| SessionError::AuthFailed("登录失败，请检查账号密码".to_string()))?;

        Ok(())
    }

    pub async fn access_jwxt(&self) -> Result<reqwest::Response, SessionError> {
        let mut headers = HeaderMap::new();
        headers.insert("Content-Type", "text/html;charset=utf-8".parse().unwrap());
        headers.insert("Vary", "Accept-Encoding".parse().unwrap());
        headers.insert("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36".parse().unwrap());

        self.client
            .get("https://jw.v.hbfu.edu.cn/")
            .headers(headers)
            .send()
            .await
            .map_err(|_| SessionError::Custom("访问教务系统失败".to_string()))
    }

    async fn login_jwxt(&self, username: &str, password: &str) -> Result<String, SessionError> {
        let encoded_username = encode_inp(username);
        let encoded_password = encode_inp(password);
        let encoded_data = format!("{}%%%{}", encoded_username, encoded_password);
        let mut form_data = HashMap::new();
        form_data.insert("encoded", encoded_data.as_str());
        let response = self
            .client
            .post("https://jw.v.hbfu.edu.cn/jsxsd/xk/LoginToXk")
            .form(&[("encoded", &encoded_data)])
            .send()
            .await
            .map_err(|_| SessionError::Custom("教务系统登录请求失败".to_string()))?;

        let text = response
            .text()
            .await
            .map_err(|_| SessionError::Custom("读取教务系统响应失败".to_string()))?;

        if text.contains("用户名或密码错误") {
            return Err(SessionError::AuthFailed(
                "教务系统账号或密码错误".to_string(),
            ));
        }
        Ok(text)
    }

    pub async fn complete_login(
        &self,
        username: &str,
        vpn_password: &str,
        oa_password: &str,
    ) -> Result<String, SessionError> {
        let flow_key = self
            .get_flow_execution_key()
            .await
            .map_err(|_| SessionError::Custom("获取vpn令牌失败".to_string()))?;
        self.login_vpn(username, vpn_password, &flow_key)
            .await
            .map_err(|_| SessionError::Custom("vpn连接失败".to_string()))?;

        self.access_jwxt()
            .await
            .map_err(|_| SessionError::Custom("访问教务系统失败".to_string()))?;

        self.login_jwxt(username, oa_password)
            .await
            .map_err(|_| SessionError::Custom("教务系统登录失败".to_string()))?;

        self.save_cookies()
            .map_err(|_| SessionError::Custom("保存cookie失败".to_string()))?;

        Ok("登录成功".to_string())
    }

    pub async fn check_jwxt_login_state(&self) -> Result<String, SessionError> {
        let text = self
            .client
            .get("https://jw.v.hbfu.edu.cn/jsxsd/framework/xsMain.jsp")
            .send()
            .await?
            .text()
            .await?;

        Ok(text)
    }

    pub async fn fetch(&self, url: &str) -> Result<String, String> {
        let response = self
            .client
            .get(url)
            .send()
            .await
            .map_err(|e| e.to_string().to_string())?;
        Ok(response.text().await.unwrap())
    }
}
