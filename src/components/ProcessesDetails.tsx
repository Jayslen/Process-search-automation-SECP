import { FileText } from "lucide-react";
import { ArticlesView } from "./processes/ArticlesView";
import { ProcessInfo } from "./processes/ProcessInfo";
import { useViewArticles } from "../hooks/useViewArticles";
import { ProcessDetailsProps } from "../types/core";

export function ProcessDetails({
  processes,
  markedProcesses,
  onToggleMark,
}: ProcessDetailsProps) {
  const {
    selectedProcessIndex,
    showArticles,
    handleChangeProcess,
    closeView,
    isProcessMarked,
  } = useViewArticles({ processes, markedProcesses });

  if (processes.length === 0) {
    return (
      <section className="bg-slate-900 rounded-lg shadow-md p-8 border border-slate-700 text-center">
        <FileText className="size-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">
          No hay procesos para mostrar. Por favor autentíquese e inicie el
          scraping.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
          <FileText className="size-5" />
          Detalles de Procesos ({processes.length})
        </h3>
        {/* List */}
        <ul className="space-y-3">
          {processes.map((process) => (
            <ProcessInfo
              key={process.code}
              process={process}
              markedProcesses={markedProcesses}
              onToggleMark={onToggleMark}
              isProcessMarked={isProcessMarked}
              showArticles={showArticles}
            />
          ))}
        </ul>
        // created image view
      </section>
      {selectedProcessIndex !== null && (
        <ArticlesView
          process={processes[selectedProcessIndex]}
          processIndex={selectedProcessIndex}
          processesLength={processes.length}
          changeProcess={handleChangeProcess}
          closeView={closeView}
          handleMarkProcess={onToggleMark}
          isProcessMarked={isProcessMarked}
        />
      )}
    </>
  );
}
