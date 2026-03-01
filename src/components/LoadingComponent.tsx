import { Loader2 } from "lucide-react";

export function LoadingComponent() {
  return (
    <div className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-full bg-slate-950/80 z-20 text-white gap-4">
      <Loader2 className="animate-spin size-18 " />

      <p className="font-bold italic animate-pulse">Buscando procesos...</p>
    </div>
  );
}
