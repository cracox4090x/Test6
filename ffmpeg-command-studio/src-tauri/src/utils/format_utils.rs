// utils/format_utils.rs

/// Format bytes to human-readable string
pub fn format_file_size(bytes: u64) -> String {
    if bytes == 0 {
        return "0 B".to_string();
    }
    const K: u64 = 1024;
    let sizes = ["B", "KB", "MB", "GB", "TB"];
    let i = (bytes as f64).log(K as f64).floor() as usize;
    let i = i.min(sizes.len() - 1);
    let val = bytes as f64 / (K as f64).powi(i as i32);
    format!("{:.1} {}", val, sizes[i])
}

/// Format duration in seconds to HH:MM:SS
pub fn format_duration(seconds: u64) -> String {
    let h = seconds / 3600;
    let m = (seconds % 3600) / 60;
    let s = seconds % 60;
    if h > 0 {
        format!("{:02}:{:02}:{:02}", h, m, s)
    } else {
        format!("{:02}:{:02}", m, s)
    }
}
