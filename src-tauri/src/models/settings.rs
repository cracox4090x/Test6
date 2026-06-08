// models/settings.rs
use serde::{Deserialize, Serialize};
use crate::models::file::FileSettings;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub version: String,
    pub default_settings: FileSettings,
    pub theme: String,
    pub language: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        use crate::models::file::{VideoSettings, AudioSettings, OutputSettings};
        Self {
            version: "4.0.0".to_string(),
            default_settings: FileSettings {
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
            },
            theme: "dark".to_string(),
            language: "ar".to_string(),
        }
    }
}
