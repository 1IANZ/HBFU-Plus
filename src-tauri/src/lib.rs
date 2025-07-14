mod session;
use crate::session::{function::*, session::HttpSession};
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::Mutex;
pub struct AppState {
    pub session: Arc<Mutex<HttpSession>>,
}

impl Drop for AppState {
    fn drop(&mut self) {
        if let Ok(session) = self.session.try_lock() {
            let _ = session.save_cookies();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().expect("无法获取应用数据目录");
            let cookie_path = app_data_dir.join("cookies.json");
            std::fs::create_dir_all(&app_data_dir).expect("创建应用数据目录失败");
            let session = HttpSession::new(cookie_path.to_str())?;
            app.manage(AppState {
                session: Arc::new(Mutex::new(session)),
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            check_cookie_and_state,
            manual_login,
            get_xsxx,
            get_semester,
            get_score,
            get_exam,
            get_xqxkch,
            get_zxjh,
            get_dekt,
            get_dekt_detail,
            get_xskb,
            download_xskb,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
