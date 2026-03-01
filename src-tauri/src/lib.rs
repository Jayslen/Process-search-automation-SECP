// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn scrape(path: &str, username: &str, password: &str) -> Result<String, String> {
    let output = Command::new("/home/jayslen/Development/automation-SECP/src/bin/bun")
        .current_dir("/home/jayslen/Development/automation-SECP/src/scripts")
        .arg("run")
        .arg("scraping.ts")
        .arg(path)
        .arg(username)
        .arg(password)
        .output();

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
