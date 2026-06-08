// models/file.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaFile {
    pub id: String,
    pub name: String,
    pub path: String,
    #[serde(rename = "fullPath")]
    pub full_path: String,
    pub size: u64,
    #[serde(rename = "mediaType")]
    pub media_type: MediaType,
    #[serde(rename = "hasFullPath")]
    pub has_full_path: bool,
    pub settings: FileSettings,
    pub selected: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum MediaType {
    Video,
    Audio,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileSettings {
    pub video: VideoSettings,
    pub audio: AudioSettings,
    pub output: OutputSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VideoSettings {
    pub enabled: bool,
    pub codec: String,
    pub preset: String,
    pub crf: u8,
    pub resolution: String,
    #[serde(rename = "customWidth")]
    pub custom_width: u32,
    #[serde(rename = "customHeight")]
    pub custom_height: u32,
    pub fps: String,
    pub bitrate: String,
    #[serde(rename = "bitrateUnit")]
    pub bitrate_unit: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AudioSettings {
    pub enabled: bool,
    pub codec: String,
    pub bitrate: String,
    #[serde(rename = "sampleRate")]
    pub sample_rate: String,
    pub channels: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutputSettings {
    pub format: String,
    pub naming: String,
    pub suffix: String,
    pub prefix: String,
    #[serde(rename = "customName")]
    pub custom_name: String,
    pub folder: String,
    pub overwrite: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanResult {
    pub files: Vec<MediaFile>,
    pub total_count: usize,
    pub video_count: usize,
    pub audio_count: usize,
}
