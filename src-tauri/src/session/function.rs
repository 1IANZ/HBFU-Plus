use crate::AppState;
use std::collections::HashMap;
use tauri::State;

#[tauri::command]
pub async fn check_cookie_and_state(state: State<'_, AppState>) -> Result<bool, String> {
    let session = state.session.lock().await;
    match session.check_jwxt_login_state().await {
        Ok(text) => Ok(text.contains("学生个人中心")),
        _ => Ok(false),
    }
}
//Login
#[tauri::command]
pub async fn manual_login(
    state: State<'_, AppState>,
    username: String,
    vpn_password: String,
    oa_password: String,
) -> Result<String, String> {
    let session = state.session.lock().await;
    let result = session
        .complete_login(&username, &vpn_password, &oa_password)
        .await;

    match result {
        Ok(text) => {
            session.save_cookies().map_err(|e| e.to_string())?;
            Ok(text)
        }
        Err(e) => Err(e.to_string()),
    }
}
//学生信息
#[tauri::command]
pub async fn get_xsxx(state: State<'_, AppState>) -> Result<String, String> {
    let session = state.session.lock().await;
    let response = session
        .fetch("https://jw.v.hbfu.edu.cn/jsxsd/grxx/xsxx")
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
//学期列表
#[tauri::command]
pub async fn get_semester(state: tauri::State<'_, AppState>) -> Result<String, String> {
    let session = state.session.lock().await;
    let response = session
        .fetch("https://jw.v.hbfu.edu.cn/jsxsd/xsks/xsksap_query")
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
//学期成绩
#[tauri::command]
pub async fn get_score(
    state: tauri::State<'_, AppState>,
    semester: &str,
) -> Result<String, String> {
    let session = state.session.lock().await;
    let mut form_data = HashMap::new();
    form_data.insert("kksj", semester);
    form_data.insert("xsfs", "all");
    let response = session
        .client
        .post("https://jw.v.hbfu.edu.cn/jsxsd/kscj/cjcx_list")
        .form(&form_data)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
//考试安排
#[tauri::command]
pub async fn get_exam(state: tauri::State<'_, AppState>, semester: &str) -> Result<String, String> {
    let session = state.session.lock().await;
    let mut form_data = HashMap::new();
    form_data.insert("xnxqid", semester);
    let response = session
        .client
        .post("https://jw.v.hbfu.edu.cn/jsxsd/xsks/xsksap_list")
        .form(&form_data)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
//学期选课查询
#[tauri::command]
pub async fn get_xqxkch(
    state: tauri::State<'_, AppState>,
    semester: &str,
) -> Result<String, String> {
    let session = state.session.lock().await;
    let mut form_data = HashMap::new();
    form_data.insert("xnxqid", semester);
    let response = session
        .client
        .post("https://jw.v.hbfu.edu.cn/jsxsd/xkgl/xqxkchList")
        .form(&form_data)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
//执行计划
#[tauri::command]
pub async fn get_zxjh(state: tauri::State<'_, AppState>) -> Result<String, String> {
    let session = state.session.lock().await;
    let response = session
        .fetch("https://jw.v.hbfu.edu.cn/jsxsd/pyfa/pyfa_query")
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
//第二课堂
#[tauri::command]
pub async fn get_dekt(state: tauri::State<'_, AppState>) -> Result<String, String> {
    let session = state.session.lock().await;
    let response = session
        .fetch("https://jw.v.hbfu.edu.cn/jsxsd/pyfa/cxxf07List")
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
#[tauri::command]
pub async fn get_dekt_detail(
    state: tauri::State<'_, AppState>,
    operation_id: &str,
) -> Result<String, String> {
    let session = state.session.lock().await;
    let response = session
        .fetch(&format!(
            "https://jw.v.hbfu.edu.cn/jsxsd/pyfa/cxxf07View?cxxf07id={}&type=view",
            operation_id
        ))
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
#[tauri::command]
pub async fn get_xskb(state: tauri::State<'_, AppState>, semester: &str) -> Result<String, String> {
    let session = state.session.lock().await;
    let mut form_data = HashMap::new();
    form_data.insert("xnxq01id", semester);
    form_data.insert("sfFD", "1");
    let response = session
        .client
        .post("https://jw.v.hbfu.edu.cn/jsxsd/xskb/xskb_list.do")
        .form(&form_data)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}
#[tauri::command]
pub async fn download_xskb(
    state: tauri::State<'_, AppState>,
    semester: &str,
) -> Result<String, String> {
    let session = state.session.lock().await;
    let mut form_data = HashMap::new();
    form_data.insert("xnxq01id", semester);
    let response = session
        .client
        .post(format!(
            "https://jw.v.hbfu.edu.cn/jsxsd/xskb/xskb_print.do?xnxq01id={}",
            semester
        ))
        .form(&form_data)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let bytes = response.bytes().await.map_err(|e| e.to_string())?;
    let mut file_path = std::path::PathBuf::new();
    file_path.push(std::env::var("USERPROFILE").unwrap());
    file_path.push("Desktop");
    file_path.push(format!("学生个人课表_{}.xls", semester));

    std::fs::write(&file_path, bytes).map_err(|e| e.to_string())?;

    Ok(format!("导出成功！文件已保存到：{}", file_path.display()))
}
