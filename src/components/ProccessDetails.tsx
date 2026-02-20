import {
  Building2,
  Hash,
  Calendar,
  ExternalLink,
  FileText,
  ImageIcon,
  Star,
} from "lucide-react";
import { useState } from "react";
import { ArticlesView, Direction } from "./ArticlesView";

export interface ProcessData {
  institution: string;
  code: string;
  title: string;
  pubDate: string | undefined;
  dueDate: string | undefined;
  url: string;
  imagePath: string;
}

interface ProcessDetailsProps {
  processes: ProcessData[];
  markedProcesses: Set<string>;
  onToggleMark: (process: ProcessData) => void;
}

export function ProcessDetails({
  processes,
  markedProcesses,
  onToggleMark,
}: ProcessDetailsProps) {
  const [currentProcessIndex, setcurrentProcessIndex] = useState<number | null>(
    null,
  );
  const showArticles = (currProcess: ProcessData) => {
    const currentIndex = processes.findIndex(
      (item) => item.code === currProcess.code,
    );
    setcurrentProcessIndex(currentIndex);
  };

  const handleChangeProcess = (direction: Direction) => {
    if (direction === Direction.Next) {
      setcurrentProcessIndex((prevIndex) => {
        if (prevIndex === null || prevIndex === processes.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    } else if (direction === Direction.Previous) {
      setcurrentProcessIndex((prevIndex) => {
        if (prevIndex === null || prevIndex === 0) {
          return processes.length - 1;
        }
        return prevIndex - 1;
      });
    }
  };

  const closeView = () => {
    setcurrentProcessIndex(null);
  };

  const isProcessMarked = (process: ProcessData) => {
    return markedProcesses.has(process.code);
  };

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
        {/* List Layout */}
        <ul className="space-y-3">
          {processes.map((process, index) => (
            <li
              key={index}
              className="bg-slate-900 rounded-md border border-slate-700 hover:border-slate-600 hover:shadow-sm transition-all p-5 flex items-center gap-6"
            >
              {/* Left Section - Main Info */}
              <section className="flex-1 min-w-0">
                <header className="flex gap-4 mb-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Building2 className="size-4 shrink-0" />
                    <span className="font-medium">{process.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Hash className="size-4 shrink-0" />
                    <span className="font-mono">{process.code}</span>
                  </div>
                </header>

                <h4 className="font-semibold text-white mb-3 capitalize">
                  {process.title}
                </h4>

                <footer className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-slate-500" />
                    <span className="text-slate-400">Publicado:</span>
                    <span className="text-slate-300 font-medium">
                      {process.pubDate
                        ? new Date(process.pubDate).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-red-400" />
                    <span className="text-slate-400">Vencimiento:</span>
                    <span className="text-slate-300 font-medium">
                      {process.dueDate
                        ? new Date(process.dueDate).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </footer>
              </section>

              {/* Right Section - Actions */}
              <section className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onToggleMark(process)}
                  className={`p-2 rounded-md transition-colors ${
                    markedProcesses.has(process.code)
                      ? "bg-yellow-900/20 hover:bg-yellow-900/30"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                  title={
                    markedProcesses.has(process.code)
                      ? "Quitar marcador"
                      : "Marcar este proceso"
                  }
                >
                  <Star
                    className={`size-5 ${
                      isProcessMarked(process)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-500"
                    }`}
                  />
                </button>

                <button
                  className="flex items-center gap-2 bg-blue-900/30 hover:bg-blue-900/40 text-blue-400 py-2 px-4 rounded-md font-medium transition-colors text-sm"
                  onClick={() => {
                    showArticles(process);
                  }}
                >
                  <ImageIcon className="size-4" />
                  Ver Articulos
                </button>

                <a
                  href={process.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-slate-600 hover:border-slate-500 hover:bg-slate-800 text-slate-300 py-2 px-4 rounded-md font-medium transition-colors text-sm"
                >
                  <ExternalLink className="size-4" />
                  Ver Fuente
                </a>
              </section>
            </li>
          ))}
        </ul>
        // created image view
      </section>
      {currentProcessIndex !== null && (
        <ArticlesView
          process={processes[currentProcessIndex]}
          processIndex={currentProcessIndex}
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
