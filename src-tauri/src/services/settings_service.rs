// services/settings_service.rs
use crate::models::settings::AppSettings;
use anyhow::Result;
use std::path::PathBuf;

pub struct SettingsService;

fn settings_path() -> PathBuf {
    dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("ffmpeg-command-studio")
        .join("settings.json")
}

impl SettingsService {
    pub fn load() -> Result<AppSettings> {
        let path = settings_path();
        if !path.exists() { return Ok(AppSettings::default()); }
        let content = std::fs::read_to_string(&path)?;
        let settings: AppSettings = serde_json::from_str(&content)?;
        Ok(settings)
    }

    pub fn save(settings: &AppSettings) -> Result<()> {
        let path = settings_path();
        std::fs::create_dir_all(path.parent().unwrap())?;
        let json = serde_json::to_string_pretty(settings)?;
        std::fs::write(&path, json)?;
        Ok(())
    }

    pub fn reset() -> Result<AppSettings> {
        let defaults = AppSettings::default();
        Self::save(&defaults)?;
        Ok(defaults)
    }

    pub fn export(export_path: &str) -> Result<()> {
        let settings = Self::load()?;
        let json = serde_json::to_string_pretty(&settings)?;
        std::fs::write(export_path, json)?;
        Ok(())
    }

    pub fn import(import_path: &str) -> Result<AppSettings> {
        let content = std::fs::read_to_string(import_path)?;
        let settings: AppSettings = serde_json::from_str(&content)?;
        Self::save(&settings)?;
        Ok(settings)
    }
}
