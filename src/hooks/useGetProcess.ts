import { useState } from "react";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import data from "../mocks/data.json";
import { ProcessData } from "../types/core";

const mockProcesses: ProcessData[] = data;
export function useGetProcess() {
  const [isLoading, setIsLoading] = useState(false);
  const [processes, setProcesses] = useState<ProcessData[]>(mockProcesses);

  const fetchProcess = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const path = await appDataDir();
    console.log(path);
    try {
      // setIsLoading(true);
      const result = await invoke("scrape", {
        path,
        username,
        password,
      });

      console.log(result);
    } catch (error) {
      console.error("Error fetching processes:", error);
    }
  };
  return { isLoading, processes, fetchProcess };
}
