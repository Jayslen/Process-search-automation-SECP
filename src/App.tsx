import "./App.css";
import { Globe } from "lucide-react";
import { ProcessDetails } from "./components/ProcessesDetails";
import { Sidebar } from "./components/Sidebar";
import { ScrapeDataForm } from "./components/Form";
import { useToggleMark } from "./hooks/useToggleMark";
import { useGetProcess } from "./hooks/useGetProcess";
import { LoadingComponent } from "./components/LoadingComponent";

function App() {
  const { isLoading, processes, fetchProcess } = useGetProcess();
  const {
    markedProcesses,
    markedProcessCodes,
    handleRemoveMark,
    handleToggleMark,
  } = useToggleMark(processes);

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        markedProcesses={markedProcesses}
        onRemoveMark={handleRemoveMark}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {isLoading && <LoadingComponent />}
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
          <ScrapeDataForm onSubmit={fetchProcess} />
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
