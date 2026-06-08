// commands/file.rs
use crate::models::file::{MediaFile, ScanResult};
use crate::services::file_service::FileService;
use serde_json::Value;
use tauri::command;

#[derive(serde::Serialize)]
pub struct ApiResponse<T: serde::Serialize> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T: serde::Serialize> ApiResponse<T> {
    pub fn ok(data: T) -> Self { Self { success: true, data: Some(data), error: None } }
    pub fn err(msg: impl ToString) -> ApiResponse<()> {
        ApiResponse { success: false, data: None, error: Some(msg.to_string()) }
    }
}

#[command]
pub async fn scan_directory(path: String, recursive: bool) -> Value {
    match FileService::scan_directory(&path, recursive) {
        Ok(result) => serde_json::to_value(ApiResponse::ok(result)).unwrap_or(serde_json::json!({"success":false,"error":"serialize error"})),
        Err(e) => serde_json::to_value(ApiResponse::<ScanResult>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn get_file_info(path: String) -> Value {
    match FileService::get_file_info(&path) {
        Ok(file) => serde_json::to_value(ApiResponse::ok(file)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<MediaFile>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn validate_media_files(paths: Vec<String>) -> Value {
    let results: Vec<Value> = paths.iter().map(|p| {
        match FileService::get_file_info(p) {
            Ok(f) => serde_json::to_value(f).unwrap_or_default(),
            Err(_) => serde_json::json!({"path": p, "valid": false}),
        }
    }).collect();
    serde_json::to_value(ApiResponse::ok(results)).unwrap_or_default()
}
