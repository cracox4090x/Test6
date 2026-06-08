# FFmpeg Command Studio v4.0

A professional desktop application for building FFmpeg commands with a beautiful dark UI.

## Features

- 🎬 Support for video and audio files
- 🛠️ Full FFmpeg command builder with all major options
- 📋 Command history with copy/export support
- 🗂️ Batch processing — add entire folders
- 🎨 Beautiful dark themed interface (Arabic RTL UI)
- 💾 Settings persistence across sessions

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand
- **Backend**: Rust + Tauri v1.5

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) 1.70+
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/setup/) prerequisites for your OS
- [FFmpeg](https://ffmpeg.org/) (optional — needed at runtime, not build time)

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri:dev

# Build for production
npm run tauri:build
```

## Project Structure

```
ffmpeg-command-studio/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities & Tauri wrappers
│   ├── store/              # Zustand state
│   └── types/              # TypeScript types
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── commands/       # Tauri command handlers
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── Cargo.toml
│   └── tauri.conf.json
└── package.json
```

## License

MIT
