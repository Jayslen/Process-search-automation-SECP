import { ArrowLeft, ArrowRight, Star, X } from "lucide-react";
import { ProcessData } from "./ProccessDetails";
import { convertFileSrc } from "@tauri-apps/api/core";

export enum Direction {
  "Next",
  "Previous",
}

export function ArticlesView({
  process,
  processIndex,
  processesLength,
  changeProcess,
  closeView,
  handleMarkProcess,
  isProcessMarked,
}: {
  process: ProcessData;
  processIndex: number;
  processesLength: number;
  changeProcess: (direction: Direction) => void;
  closeView: () => void;
  handleMarkProcess: (process: ProcessData) => void;
  isProcessMarked: (process: ProcessData) => boolean;
}) {
  const { title, code, imagePath } = process;
  const nextProcess = () => {
    changeProcess(Direction.Next);
  };
  const prevProcess = () => {
    changeProcess(Direction.Previous);
  };
  return (
    <div className="w-screen h-screen bg-black/80 absolute top-0 left-0 grid place-items-center">
      <section className="max-w-6xl  hover:shadow-sm transition-all">
        <header className="flex items-center justify-between mb-4 bg-slate-900 rounded-md border border-slate-700 p-5">
          <div className="text-white">
            <h3
              className="text-md font-bold max-w-3xl capitalize
              "
            >
              {title.toLocaleLowerCase()}
            </h3>
            <h4 className="text-sm italic">{code}</h4>
            <span className="text-gray-200 text-base italic">
              {processIndex + 1}/{processesLength}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star
              className={`size-8 bg-slate-800 hover:bg-slate-700 rounded-md transition-all cursor-pointer p-1 hover:scale-90 ${
                isProcessMarked(process)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-50"
              }`}
              onClick={() => handleMarkProcess(process)}
            />
            <ArrowLeft
              className="size-8 bg-slate-800 hover:bg-slate-700 text-gray-50 rounded-md transition-all cursor-pointer p-1 hover:scale-90"
              onClick={prevProcess}
            />
            <ArrowRight
              className="size-8 bg-slate-800 hover:bg-slate-700 text-gray-50 rounded-md transition-all cursor-pointer p-1 hover:scale-90"
              onClick={nextProcess}
            />
            <X
              className="size-8 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-md transition-all cursor-pointer p-1 hover:scale-90"
              onClick={closeView}
            />
          </div>
        </header>
        <div className="w-full h-100 overflow-auto">
          <img src={convertFileSrc(imagePath)} alt={title} />
        </div>
      </section>
    </div>
  );
}
