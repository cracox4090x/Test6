// commands/system.rs
use serde_json::Value;
use tauri::command;
use tauri::Manager;
use super::file::ApiResponse;
use std::process::Command;

#[derive(serde::Serialize)]
pub struct OsInfo {
    pub platform: String,
    pub arch: String,
    pub version: String,
}

#[command]
pub async fn get_os_info() -> Value {
    let info = OsInfo {
        platform: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        version: "unknown".to_string(),
    };
    serde_json::to_value(ApiResponse::ok(info)).unwrap_or_default()
}

#[command]
pub async fn open_external_link(url: String) -> Value {
    #[cfg(target_os = "windows")]
    let result = Command::new("cmd").args(&["/C", "start", &url]).status();
    #[cfg(target_os = "macos")]
    let result = Command::new("open").arg(&url).status();
    #[cfg(target_os = "linux")]
    let result = Command::new("xdg-open").arg(&url).status();

    #[allow(unused_variables)]
    match result {
        Ok(_) => serde_json::to_value(ApiResponse::ok(true)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn show_in_folder(path: String) -> Value {
    #[cfg(target_os = "windows")]
    let result = Command::new("explorer").args(&["/select,", &path]).status();
    #[cfg(target_os = "macos")]
    let result = Command::new("open").args(&["-R", &path]).status();
    #[cfg(target_os = "linux")]
    let result = Command::new("xdg-open").arg(
        std::path::Path::new(&path).parent().unwrap_or(std::path::Path::new("/")).to_str().unwrap_or("/")
    ).status();

    #[allow(unused_variables)]
    match result {
        Ok(_) => serde_json::to_value(ApiResponse::ok(true)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}
