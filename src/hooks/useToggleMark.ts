import { useState } from "react";
import { ProcessData } from "../types/core";

export function useToggleMark(processes: ProcessData[]) {
  const [markedProcessCodes, setMarkedProcessCodes] = useState<Set<string>>(
    new Set(),
  );

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
  return {
    markedProcessCodes,
    handleToggleMark,
    handleRemoveMark,
    markedProcesses,
  };
}
