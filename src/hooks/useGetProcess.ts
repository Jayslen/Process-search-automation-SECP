import { useEffect, useState } from "react";
import { appDataDir, BaseDirectory } from "@tauri-apps/api/path";
import { readTextFile, exists } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";
import { ProcessData } from "../types/core";
import toast from "react-hot-toast";

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
    try {
      const result = await invoke("scrape", {
        path,
        username,
        password,
      });
      const data = JSON.parse(result as string) as ProcessData[];
      if (data.length > 0) {
        toast.success(`Se han encontrado ${data.length} nuevos procesos.`);
        setProcesses((prev) => [...prev, ...data]);
      } else {
        toast("No se encontraron nuevos procesos.");
      }
    } catch (error) {
      console.error("Error fetching processes:", error);
      toast.error(
        "Ocurrió un error al obtener los procesos. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, processes, fetchProcess };
}
