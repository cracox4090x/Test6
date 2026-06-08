// services/ffmpeg_service.rs
use crate::models::ffmpeg::{FFmpegCommand, FFmpegInfo, FFmpegPreset};
use crate::models::file::{MediaFile, MediaType};
use crate::utils::path_utils::{get_file_stem, get_parent_dir, is_absolute_path};
use anyhow::Result;
use std::process::Command;

pub struct FFmpegService;

impl FFmpegService {
    pub fn generate_command(file: &MediaFile) -> Result<FFmpegCommand> {
        let mut parts: Vec<String> = vec!["ffmpeg".to_string()];

        if file.settings.output.overwrite {
            parts.push("-y".to_string());
        }

        let input_path = if file.has_full_path {
            file.full_path.clone()
        } else {
            file.path.clone()
        };

        parts.push("-i".to_string());
        parts.push(format!("\"{}\"", input_path));

        // Video settings
        match &file.media_type {
            MediaType::Video => {
                if !file.settings.video.enabled {
                    parts.push("-vn".to_string());
                } else {
                    parts.push("-c:v".to_string());
                    parts.push(file.settings.video.codec.clone());

                    if file.settings.video.codec != "copy" {
                        parts.push("-preset".to_string());
                        parts.push(file.settings.video.preset.clone());

                        if !file.settings.video.bitrate.is_empty() {
                            parts.push("-b:v".to_string());
                            parts.push(format!(
                                "{}{}",
                                file.settings.video.bitrate, file.settings.video.bitrate_unit
                            ));
                        } else {
                            parts.push("-crf".to_string());
                            parts.push(file.settings.video.crf.to_string());
                        }

                        if file.settings.video.resolution != "original" && file.settings.video.resolution != "custom" {
                            let vf = format!("scale={}", file.settings.video.resolution.replace("x", ":"));
                            parts.push("-vf".to_string());
                            parts.push(vf);
                        } else if file.settings.video.resolution == "custom" {
                            let vf = format!(
                                "scale={}:{}",
                                file.settings.video.custom_width, file.settings.video.custom_height
                            );
                            parts.push("-vf".to_string());
                            parts.push(vf);
                        }

                        if file.settings.video.fps != "original" {
                            parts.push("-r".to_string());
                            parts.push(file.settings.video.fps.clone());
                        }
                    }
                }
            }
            _ => {
                parts.push("-vn".to_string());
            }
        }

        // Audio settings
        if !file.settings.audio.enabled {
            parts.push("-an".to_string());
        } else {
            parts.push("-c:a".to_string());
            parts.push(file.settings.audio.codec.clone());

            if file.settings.audio.codec != "copy"
                && file.settings.audio.codec != "flac"
                && file.settings.audio.codec != "pcm_s16le"
                && !file.settings.audio.bitrate.is_empty()
            {
                parts.push("-b:a".to_string());
                parts.push(file.settings.audio.bitrate.clone());
            }

            if file.settings.audio.sample_rate != "original" {
                parts.push("-ar".to_string());
                parts.push(file.settings.audio.sample_rate.clone());
            }

            if file.settings.audio.channels != "original" {
                parts.push("-ac".to_string());
                parts.push(file.settings.audio.channels.clone());
            }
        }

        // Generate output filename
        let stem = get_file_stem(&input_path);
        let output_name = match file.settings.output.naming.as_str() {
            "suffix" => format!("{}{}.{}", stem, file.settings.output.suffix, file.settings.output.format),
            "prefix" => format!("{}{}.{}", file.settings.output.prefix, stem, file.settings.output.format),
            "custom" if !file.settings.output.custom_name.is_empty() => {
                format!("{}.{}", file.settings.output.custom_name, file.settings.output.format)
            }
            _ => format!("{}_converted.{}", stem, file.settings.output.format),
        };

        let output_dir = if !file.settings.output.folder.is_empty() {
            file.settings.output.folder.clone()
        } else if is_absolute_path(&input_path) {
            get_parent_dir(&input_path)
        } else {
            String::new()
        };

        let output_path = if output_dir.is_empty() {
            output_name.clone()
        } else {
            format!("{}/{}", output_dir.trim_end_matches('/'), output_name)
        };

        parts.push(format!("\"{}\"", output_path));

        let command = parts.join(" ");
        Ok(FFmpegCommand {
            command,
            parts,
            input_file: input_path,
            output_file: output_path,
            estimated_size: None,
            duration_estimate: None,
        })
    }

    pub fn check_installation() -> FFmpegInfo {
        let result = Command::new("ffmpeg").arg("-version").output();
        match result {
            Ok(output) if output.status.success() => {
                let version_output = String::from_utf8_lossy(&output.stdout);
                let version = version_output
                    .lines()
                    .next()
                    .and_then(|l| l.split("version ").nth(1))
                    .and_then(|v| v.split_whitespace().next())
                    .map(|v| v.to_string());
                let path = which_ffmpeg();
                FFmpegInfo { installed: true, version, path, codecs: vec![], formats: vec![] }
            }
            _ => FFmpegInfo { installed: false, version: None, path: None, codecs: vec![], formats: vec![] },
        }
    }

    pub fn get_presets() -> Vec<FFmpegPreset> {
        vec![
            FFmpegPreset {
                id: "web_h264".to_string(),
                name: "Web H.264".to_string(),
                description: "Optimized for web streaming".to_string(),
                category: "web".to_string(),
                settings: serde_json::json!({ "video": { "codec": "libx264", "preset": "fast", "crf": 23 }, "audio": { "codec": "aac", "bitrate": "128k" } }),
            },
            FFmpegPreset {
                id: "high_quality".to_string(),
                name: "High Quality".to_string(),
                description: "Maximum quality preservation".to_string(),
                category: "quality".to_string(),
                settings: serde_json::json!({ "video": { "codec": "libx265", "preset": "slow", "crf": 18 }, "audio": { "codec": "flac" } }),
            },
            FFmpegPreset {
                id: "audio_extract".to_string(),
                name: "Extract Audio".to_string(),
                description: "Extract audio from video".to_string(),
                category: "audio".to_string(),
                settings: serde_json::json!({ "video": { "enabled": false }, "audio": { "codec": "aac", "bitrate": "320k" }, "output": { "format": "mp3" } }),
            },
        ]
    }
}

fn which_ffmpeg() -> Option<String> {
    let cmd = if cfg!(target_os = "windows") { "where" } else { "which" };
    Command::new(cmd).arg("ffmpeg").output().ok()
        .and_then(|o| if o.status.success() {
            String::from_utf8(o.stdout).ok().map(|s| s.trim().to_string())
        } else { None })
}
