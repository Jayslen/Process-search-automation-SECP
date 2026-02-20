import { Key, User, LogIn } from "lucide-react";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  isLoading?: boolean;
}

export function ScrapeDataForm({
  onSubmit,
  isLoading = false,
}: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit("username", "password");
  };

  return (
    <div className="bg-slate-900 rounded-md border border-slate-700 p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-300">
        <LogIn className="size-4" />
        Autenticación
      </h3>
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <label
            htmlFor="username"
            className="block text-xs font-medium text-slate-400 mb-1"
          >
            Usuario
          </label>
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
            <input
              type="text"
              id="username"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-800 text-slate-100 placeholder:text-slate-500"
              placeholder="Usuario"
              required
            />
          </div>
        </div>

        <div className="flex-1">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-slate-400 mb-1"
          >
            Contraseña
          </label>
          <div className="relative">
            <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
            <input
              type="password"
              id="password"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-800 text-slate-100 placeholder:text-slate-500"
              placeholder="Contraseña"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? "Conectando..." : "Iniciar"}
        </button>
      </form>
    </div>
  );
}
