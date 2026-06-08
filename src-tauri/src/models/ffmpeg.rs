// models/ffmpeg.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FFmpegCommand {
    pub command: String,
    pub parts: Vec<String>,
    #[serde(rename = "inputFile")]
    pub input_file: String,
    #[serde(rename = "outputFile")]
    pub output_file: String,
    #[serde(rename = "estimatedSize")]
    pub estimated_size: Option<String>,
    #[serde(rename = "durationEstimate")]
    pub duration_estimate: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FFmpegInfo {
    pub installed: bool,
    pub version: Option<String>,
    pub path: Option<String>,
    pub codecs: Vec<String>,
    pub formats: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FFmpegPreset {
    pub id: String,
    pub name: String,
    pub description: String,
    pub category: String,
    pub settings: serde_json::Value,
}
