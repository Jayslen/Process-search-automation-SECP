// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{AppHandle, Manager};
use tokio::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn scrape(
    app: AppHandle,
    path: String,
    username: String,
    password: String,
) -> Result<String, String> {
    let bun_path = app
        .path()
        .resolve("utils/bun", tauri::path::BaseDirectory::Resource)
        .expect("Bun binary not found");

    let script_path = app
        .path()
        .resolve("utils/scraping.ts", tauri::path::BaseDirectory::Resource)
        .expect("Scraping script not found");

    let output = Command::new(bun_path)
        .arg("run")
        .arg(script_path)
        .arg(path)
        .arg(username)
        .arg(password)
        .output()
        .await;

    match output {
        Ok(output) => {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout).to_string();
                Ok(stdout)
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr).to_string();
                Err(stderr)
            }
        }
        Err(e) => Err(format!("Failed to execute scrape: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, scrape])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
