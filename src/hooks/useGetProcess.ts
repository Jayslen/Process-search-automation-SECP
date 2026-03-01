import { useEffect, useState } from "react";
import { appDataDir, BaseDirectory } from "@tauri-apps/api/path";
import { readTextFile, exists } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";
import { ProcessData } from "../types/core";

export function useGetProcess() {
  const [isLoading, setIsLoading] = useState(false);
  const [processes, setProcesses] = useState<ProcessData[]>([]);

  const getProcess = async () => {
    const fileExits = await exists("process_results.json", {
      baseDir: BaseDirectory.AppData,
    });
    if (!fileExits) {
      return console.log("Not process found...");
    }

    const processFile = await readTextFile("process_results.json", {
      baseDir: BaseDirectory.AppData,
    });

    const data = JSON.parse(processFile) as ProcessData[];

    setProcesses(data);
  };

  useEffect(() => {
    getProcess();
  });

  const fetchProcess = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);

    const path = await appDataDir();
    console.log("Comenzando proceso de scraping...");
    try {
      await invoke("scrape", {
        path,
        username,
        password,
      });
      await getProcess();
    } catch (error) {
      console.error("Error fetching processes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, processes, fetchProcess };
}
