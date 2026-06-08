// services/history_service.rs
use crate::models::history::HistoryEntry;
use anyhow::Result;
use std::path::PathBuf;

pub struct HistoryService;

fn history_path() -> PathBuf {
    dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("ffmpeg-command-studio")
        .join("history.json")
}

impl HistoryService {
    pub fn load() -> Result<Vec<HistoryEntry>> {
        let path = history_path();
        if !path.exists() { return Ok(vec![]); }
        let content = std::fs::read_to_string(&path)?;
        let entries: Vec<HistoryEntry> = serde_json::from_str(&content)?;
        Ok(entries)
    }

    pub fn save(entry: &HistoryEntry) -> Result<()> {
        let path = history_path();
        std::fs::create_dir_all(path.parent().unwrap())?;
        let mut entries = Self::load().unwrap_or_default();
        entries.insert(0, entry.clone());
        entries.truncate(100);
        let json = serde_json::to_string_pretty(&entries)?;
        std::fs::write(&path, json)?;
        Ok(())
    }

    pub fn clear() -> Result<()> {
        let path = history_path();
        if path.exists() { std::fs::remove_file(&path)?; }
        Ok(())
    }

    pub fn export(export_path: &str) -> Result<()> {
        let entries = Self::load()?;
        let json = serde_json::to_string_pretty(&entries)?;
        std::fs::write(export_path, json)?;
        Ok(())
    }
}
