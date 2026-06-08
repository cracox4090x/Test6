// commands/settings.rs
use crate::services::settings_service::SettingsService;
use serde_json::Value;
use tauri::command;
use super::file::ApiResponse;

#[command]
pub async fn load_settings() -> Value {
    match SettingsService::load() {
        Ok(s) => serde_json::to_value(ApiResponse::ok(s)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn save_settings(settings: Value) -> Value {
    match serde_json::from_value(settings) {
        Ok(s) => match SettingsService::save(&s) {
            Ok(_) => serde_json::to_value(ApiResponse::ok(true)).unwrap_or_default(),
            Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
        },
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn reset_settings() -> Value {
    match SettingsService::reset() {
        Ok(s) => serde_json::to_value(ApiResponse::ok(s)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn export_settings(path: String) -> Value {
    match SettingsService::export(&path) {
        Ok(_) => serde_json::to_value(ApiResponse::ok(true)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn import_settings(path: String) -> Value {
    match SettingsService::import(&path) {
        Ok(s) => serde_json::to_value(ApiResponse::ok(s)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}
