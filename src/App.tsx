import "./App.css";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { BaseDirectory, appDataDir } from "@tauri-apps/api/path";
import { ProcessData, ProcessDetails } from "./components/ProccessDetails";
import { Sidebar } from "./components/Sidebar";
import { ScrapeDataForm } from "./components/Form";
import data from "./mocks/data.json";

const mockProcesses: ProcessData[] = data;

console.log(await appDataDir());
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [processes, setProcesses] = useState<ProcessData[]>(mockProcesses);
  const [markedProcessCodes, setMarkedProcessCodes] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    setProcesses(mockProcesses);
  }, []);

  const handleToggleMark = (process: ProcessData) => {
    setMarkedProcessCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(process.code)) {
        newSet.delete(process.code);
      } else {
        newSet.add(process.code);
      }
      return newSet;
    });
  };

  const handleRemoveMark = (processCode: string) => {
    setMarkedProcessCodes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(processCode);
      return newSet;
    });
  };

  const markedProcesses = processes.filter((process) =>
    markedProcessCodes.has(process.code),
  );
  return (
    <>
      {/* Sidebar */}
      <Sidebar
        markedProcesses={markedProcesses}
        onRemoveMark={handleRemoveMark}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <header className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Globe className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Proceso de Licitación Web Scraping
              </h1>
              <p className="text-slate-400 mt-1">
                Herramienta automatizada de web scraping para procesos de
                contratación y licitación. Monitorea, rastrea y gestiona
                procesos institucionales de manera eficiente.
              </p>
            </div>
          </header>
          {/* Login Form */}
          <ScrapeDataForm
            onSubmit={() => {
              console.log("Scraping started");
            }}
            isLoading={isLoading}
          />
          Process Details
          <ProcessDetails
            processes={processes}
            markedProcesses={markedProcessCodes}
            onToggleMark={handleToggleMark}
          />
        </div>
      </main>
    </>
  );
}

export default App;
