// services/file_service.rs
use crate::models::file::{AudioSettings, FileSettings, MediaFile, MediaType, OutputSettings, ScanResult, VideoSettings};
use crate::utils::path_utils::{get_extension, get_file_name, get_media_type_from_ext, is_absolute_path};
use anyhow::Result;
use std::path::Path;
use walkdir::WalkDir;

pub struct FileService;

impl FileService {
    pub fn scan_directory(path: &str, recursive: bool) -> Result<ScanResult> {
        let mut files: Vec<MediaFile> = Vec::new();
        let walker = if recursive {
            WalkDir::new(path).max_depth(10)
        } else {
            WalkDir::new(path).max_depth(1)
        };

        for entry in walker.into_iter().filter_map(|e| e.ok()) {
            let p = entry.path();
            if !p.is_file() { continue; }
            let ext = p.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();
            let media_type_str = get_media_type_from_ext(&ext);
            if media_type_str == "unknown" { continue; }

            let full_path = p.to_string_lossy().to_string();
            let name = get_file_name(&full_path);
            let size = p.metadata().map(|m| m.len()).unwrap_or(0);
            let media_type = match media_type_str {
                "video" => MediaType::Video,
                "audio" => MediaType::Audio,
                _ => MediaType::Unknown,
            };

            files.push(MediaFile {
                id: format!("f_{}_{}", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_millis(), rand_suffix()),
                name,
                path: full_path.clone(),
                full_path: full_path.clone(),
                size,
                media_type,
                has_full_path: is_absolute_path(&full_path),
                settings: default_settings(),
                selected: false,
            });
        }

        let video_count = files.iter().filter(|f| matches!(f.media_type, MediaType::Video)).count();
        let audio_count = files.iter().filter(|f| matches!(f.media_type, MediaType::Audio)).count();
        let total_count = files.len();
        Ok(ScanResult { files, total_count, video_count, audio_count })
    }

    pub fn get_file_info(path: &str) -> Result<MediaFile> {
        let p = Path::new(path);
        let full_path = p.canonicalize()
            .map(|cp| cp.to_string_lossy().to_string())
            .unwrap_or_else(|_| path.to_string());
        let name = get_file_name(&full_path);
        let size = p.metadata().map(|m| m.len()).unwrap_or(0);
        let ext = get_extension(&full_path);
        let media_type_str = get_media_type_from_ext(&ext);
        let media_type = match media_type_str {
            "video" => MediaType::Video,
            "audio" => MediaType::Audio,
            _ => MediaType::Unknown,
        };

        Ok(MediaFile {
            id: format!("f_{}", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_millis()),
            name,
            path: path.to_string(),
            full_path: full_path.clone(),
            size,
            media_type,
            has_full_path: is_absolute_path(&full_path),
            settings: default_settings(),
            selected: false,
        })
    }
}

fn rand_suffix() -> u32 {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    let mut h = DefaultHasher::new();
    std::time::SystemTime::now().hash(&mut h);
    h.finish() as u32
}

pub fn default_settings() -> FileSettings {
    FileSettings {
        video: VideoSettings {
            enabled: true,
            codec: "libx264".to_string(),
            preset: "medium".to_string(),
            crf: 23,
            resolution: "1920x1080".to_string(),
            custom_width: 1920,
            custom_height: 1080,
            fps: "original".to_string(),
            bitrate: String::new(),
            bitrate_unit: "k".to_string(),
        },
        audio: AudioSettings {
            enabled: true,
            codec: "aac".to_string(),
            bitrate: "320k".to_string(),
            sample_rate: "44100".to_string(),
            channels: "original".to_string(),
        },
        output: OutputSettings {
            format: "mp4".to_string(),
            naming: "suffix".to_string(),
            suffix: "_converted".to_string(),
            prefix: String::new(),
            custom_name: String::new(),
            folder: String::new(),
            overwrite: false,
        },
    }
}
