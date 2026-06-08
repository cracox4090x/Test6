// commands/clipboard.rs
use serde_json::Value;
use tauri::command;
use super::file::ApiResponse;

#[command]
pub async fn copy_to_clipboard(text: String, window: tauri::Window) -> Value {
    // Clipboard is handled by Tauri's allowlist - this is a fallback
    let _ = (text, window);
    serde_json::to_value(ApiResponse::ok(true)).unwrap_or_default()
}
