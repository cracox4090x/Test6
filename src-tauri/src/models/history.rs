// models/history.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryEntry {
    pub id: String,
    pub time: String,
    pub date: String,
    pub commands: Vec<String>,
    #[serde(rename = "fileCount")]
    pub file_count: usize,
    #[serde(rename = "fileNames")]
    pub file_names: Vec<String>,
}
