// main.rs - Tauri application entry point
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod models;
mod services;
mod utils;

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // System tray menu
    let show_item = CustomMenuItem::new("show".to_string(), "Show");
    let quit_item = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show_item)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit_item);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "show" => {
                    if let Some(window) = app.get_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            SystemTrayEvent::LeftClick { .. } => {
                if let Some(window) = app.get_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            // File commands
            commands::file::scan_directory,
            commands::file::get_file_info,
            commands::file::validate_media_files,
            // FFmpeg commands
            commands::ffmpeg::generate_command,
            commands::ffmpeg::generate_batch_commands,
            commands::ffmpeg::validate_ffmpeg_installation,
            commands::ffmpeg::get_ffmpeg_presets,
            // History commands
            commands::history::load_history,
            commands::history::save_history,
            commands::history::clear_history,
            commands::history::export_history,
            // Settings commands
            commands::settings::load_settings,
            commands::settings::save_settings,
            commands::settings::reset_settings,
            commands::settings::export_settings,
            commands::settings::import_settings,
            // System commands
            commands::system::get_os_info,
            commands::system::open_external_link,
            commands::system::show_in_folder,
            // Clipboard commands
            commands::clipboard::copy_to_clipboard,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
