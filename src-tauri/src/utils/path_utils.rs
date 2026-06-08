// utils/path_utils.rs
use std::path::Path;

/// Normalize a path to use forward slashes
pub fn normalize_path(path: &str) -> String {
    path.replace('\\', "/")
}

/// Get the file name from a path
pub fn get_file_name(path: &str) -> String {
    Path::new(path)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or(path)
        .to_string()
}

/// Get the file stem (name without extension)
pub fn get_file_stem(path: &str) -> String {
    Path::new(path)
        .file_stem()
        .and_then(|n| n.to_str())
        .unwrap_or(path)
        .to_string()
}

/// Get the parent directory of a path
pub fn get_parent_dir(path: &str) -> String {
    Path::new(path)
        .parent()
        .and_then(|p| p.to_str())
        .unwrap_or("")
        .to_string()
}

/// Check if a path is absolute
pub fn is_absolute_path(path: &str) -> bool {
    Path::new(path).is_absolute()
}

/// Get the file extension
pub fn get_extension(path: &str) -> String {
    Path::new(path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase()
}

/// Get media type from file extension
pub fn get_media_type_from_ext(ext: &str) -> &'static str {
    match ext.to_lowercase().as_str() {
        "mp4" | "mkv" | "avi" | "mov" | "wmv" | "flv" | "webm" | "m4v" | "mpeg" | "mpg" | "3gp" => "video",
        "mp3" | "aac" | "wav" | "flac" | "ogg" | "m4a" | "wma" | "opus" => "audio",
        _ => "unknown",
    }
}
