import { Bookmark, Star } from "lucide-react";
import { ProcessData } from "../types/core";
import { formatDate } from "../utils/formatDate";

interface SidebarProps {
  markedProcesses: ProcessData[];
  onRemoveMark: (processCode: string) => void;
}

export function Sidebar({ markedProcesses, onRemoveMark }: SidebarProps) {
  return (
    <aside className="w-80 bg-slate-900 text-white flex flex-col h-full">
      <header className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Star className="size-6 fill-yellow-400 text-yellow-400" />
          <h2 className="text-lg font-semibold">Procesos Marcados</h2>
        </div>
        <p className="text-xs text-slate-400">Tus procesos guardados</p>
      </header>

      <ul className="flex-1 overflow-y-auto p-4 space-y-3">
        {markedProcesses.length === 0 ? (
          <div className="text-center text-slate-400 mt-8 px-4">
            <Bookmark className="size-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No hay procesos marcados aún</p>
            <p className="text-xs mt-1">
              Haz clic en el ícono de estrella en cualquier proceso para
              guardarlo aquí
            </p>
          </div>
        ) : (
          markedProcesses.map(({ code, title, institution, dueDate }) => (
            <li
              key={code}
              className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors"
            >
              <header className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm line-clamp-2 flex-1">
                  {title}
                </h4>
                <button
                  onClick={() => onRemoveMark(code)}
                  className="shrink-0 p-1 hover:bg-slate-700 rounded transition-colors"
                  title="Quitar marcador"
                >
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                </button>
              </header>

              <span className="text-xs text-slate-400 mb-2">{institution}</span>

              <div className="flex items-center gap-2 text-xs">
                <span className="bg-slate-700 px-2 py-1 rounded font-mono">
                  {code}
                </span>
              </div>

              <footer className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-400">
                Vencimiento: {formatDate(dueDate)}
              </footer>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
