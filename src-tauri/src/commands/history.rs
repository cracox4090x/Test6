// commands/history.rs
use crate::models::history::HistoryEntry;
use crate::services::history_service::HistoryService;
use serde_json::Value;
use tauri::command;
use super::file::ApiResponse;

#[command]
pub async fn load_history() -> Value {
    match HistoryService::load() {
        Ok(entries) => serde_json::to_value(ApiResponse::ok(entries)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn save_history(entry: HistoryEntry) -> Value {
    match HistoryService::save(&entry) {
        Ok(_) => serde_json::to_value(ApiResponse::ok(true)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn clear_history() -> Value {
    match HistoryService::clear() {
        Ok(_) => serde_json::to_value(ApiResponse::ok(true)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn export_history(path: String) -> Value {
    match HistoryService::export(&path) {
        Ok(_) => serde_json::to_value(ApiResponse::ok(true)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}
