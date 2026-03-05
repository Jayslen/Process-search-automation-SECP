import { FileText } from "lucide-react";
import { ArticlesView } from "./processes/ArticlesView";
import { ProcessInfo } from "./processes/ProcessInfo";
import { useViewArticles } from "../hooks/useViewArticles";
import { ProcessDetailsProps } from "../types/core";

export function ProcessDetails({
  processes,
  markedProcesses,
  onToggleMark,
  onSearch,
}: ProcessDetailsProps) {
  const {
    selectedProcessIndex,
    showArticles,
    handleChangeProcess,
    closeView,
    isProcessMarked,
  } = useViewArticles({ processes, markedProcesses });

  const filterProcess = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSearch(data.search as string);
  };

  return (
    <>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
          <FileText className="size-5" />
          Detalles de Procesos ({processes.length})
        </h3>
        <form className="flex gap-4" onSubmit={filterProcess}>
          <input
            name="search"
            type="text"
            placeholder="Buscar por código o título..."
            className="w-full p-2 text-sm border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-800 text-slate-100 placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Buscar
          </button>
        </form>
        {processes.length === 0 && (
          <div className="bg-slate-900 rounded-lg shadow-md p-8 border border-slate-700 text-center">
            <FileText className="size-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              No hay procesos para mostrar. Por favor autentíquese e inicie el
              scraping.
            </p>
          </div>
        )}
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
