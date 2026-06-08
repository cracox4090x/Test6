// commands/ffmpeg.rs
use crate::models::file::MediaFile;
use crate::services::ffmpeg_service::FFmpegService;
use serde_json::Value;
use tauri::command;
use super::file::ApiResponse;

#[command]
pub async fn generate_command(file: MediaFile) -> Value {
    match FFmpegService::generate_command(&file) {
        Ok(cmd) => serde_json::to_value(ApiResponse::ok(cmd)).unwrap_or_default(),
        Err(e) => serde_json::to_value(ApiResponse::<()>::err(e)).unwrap_or_default(),
    }
}

#[command]
pub async fn generate_batch_commands(files: Vec<MediaFile>) -> Value {
    let results: Vec<Value> = files.iter().map(|f| {
        match FFmpegService::generate_command(f) {
            Ok(cmd) => serde_json::to_value(cmd).unwrap_or_default(),
            Err(e) => serde_json::json!({"error": e.to_string()}),
        }
    }).collect();
    serde_json::to_value(ApiResponse::ok(results)).unwrap_or_default()
}

#[command]
pub async fn validate_ffmpeg_installation() -> Value {
    let info = FFmpegService::check_installation();
    serde_json::to_value(ApiResponse::ok(info)).unwrap_or_default()
}

#[command]
pub async fn get_ffmpeg_presets() -> Value {
    let presets = FFmpegService::get_presets();
    serde_json::to_value(ApiResponse::ok(presets)).unwrap_or_default()
}
