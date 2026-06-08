# Architecture

## Overview

FFmpeg Command Studio uses a Tauri-based architecture with React frontend and Rust backend.

## Frontend (src/)

- **State**: Zustand with persistence middleware
- **UI**: React + Tailwind CSS with dark theme
- **Tauri bridge**: `src/lib/tauri.ts` wraps all `invoke()` calls
- **Hooks**: `useTauri.ts` provides high-level operations
- **Types**: Central type definitions in `src/types/index.ts`

## Backend (src-tauri/src/)

- **Commands**: Tauri command handlers registered in `main.rs`
- **Services**: Business logic separated per domain
  - `ffmpeg_service`: Command generation, FFmpeg detection
  - `file_service`: Directory scanning, file metadata
  - `history_service`: Persistent command history (JSON)
  - `settings_service`: Persistent settings (JSON)
- **Models**: Serde-serializable structs matching TypeScript types
- **Utils**: Path normalization, formatting helpers

## Data Flow

1. User interaction in React component
2. Hook calls service via `invoke()` through `lib/tauri.ts`
3. Tauri routes to Rust command handler
4. Command delegates to service
5. Service returns `ApiResponse<T>` (success + data or error)
6. Frontend updates Zustand store
