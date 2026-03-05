import {
  Building2,
  Calendar,
  ExternalLink,
  Hash,
  ImageIcon,
  Star,
} from "lucide-react";
import { ProcessData } from "../../types/core";
import { formatDate } from "../../utils/formatDate";

export function ProcessInfo({
  process,
  markedProcesses,
  onToggleMark,
  isProcessMarked,
  showArticles,
}: {
  process: ProcessData;
  markedProcesses: Set<string>;
  onToggleMark: (process: ProcessData) => void;
  isProcessMarked: (process: ProcessData) => boolean;
  showArticles: (process: ProcessData) => void;
}) {
  const { institution, code, title, pubDate, dueDate, timestamp } = process;

  const diffInMinutes = timestamp
    ? Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000)
    : null;

  const isNew = diffInMinutes !== null && diffInMinutes <= 30; // Consider as "Nuevo" if published within the last 30 mins

  return (
    <li className="bg-slate-900 rounded-md border border-slate-700 hover:border-slate-600 hover:shadow-sm transition-all p-5 flex items-center gap-6 relative">
      {isNew && (
        <p className="absolute -top-2 -left-2  text-yellow-400 text-xs font-bold px-2 py-1 rounded -rotate-6 bg-yellow-900/30">
          Nuevo
        </p>
      )}
      {/* Left Section - Main Info */}
      <section className="flex-1 min-w-0">
        <header className="flex gap-4 mb-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Building2 className="size-4 shrink-0" />
            <span className="font-medium">{institution}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Hash className="size-4 shrink-0" />
            <span className="font-mono">{code}</span>
          </div>
        </header>

        <h4 className="font-semibold text-white mb-3 capitalize">{title}</h4>

        <footer className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-slate-500" />
            <span className="text-slate-400">Publicado:</span>
            <span className="text-slate-300 font-medium capitalize">
              {formatDate(pubDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-red-400" />
            <span className="text-slate-400">Vencimiento:</span>
            <span className="text-slate-300 font-medium capitalize">
              {formatDate(dueDate)}
            </span>
          </div>
        </footer>
      </section>

      {/* Right Section - Actions */}
      <section className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onToggleMark(process)}
          className={`p-2 rounded-md transition-colors ${
            markedProcesses.has(code)
              ? "bg-yellow-900/20 hover:bg-yellow-900/30"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
          title={
            markedProcesses.has(code)
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
  );
}
