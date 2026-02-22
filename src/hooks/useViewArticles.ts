import { useState } from "react";
import { Direction, ProcessData } from "../types/core";
export function useViewArticles({
  processes,
  markedProcesses,
}: {
  processes: ProcessData[];
  markedProcesses: Set<string>;
}) {
  const [selectedProcessIndex, setSelectedProcessIndex] = useState<
    number | null
  >(null);

  const showArticles = (currProcess: ProcessData) => {
    const currentIndex = processes.findIndex(
      (item) => item.code === currProcess.code,
    );
    setSelectedProcessIndex(currentIndex);
  };

  const handleChangeProcess = (direction: Direction) => {
    if (direction === Direction.Next) {
      setSelectedProcessIndex((prevIndex) => {
        if (prevIndex === null || prevIndex === processes.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    } else if (direction === Direction.Previous) {
      setSelectedProcessIndex((prevIndex) => {
        if (prevIndex === null || prevIndex === 0) {
          return processes.length - 1;
        }
        return prevIndex - 1;
      });
    }
  };

  const closeView = () => {
    setSelectedProcessIndex(null);
  };

  const isProcessMarked = (process: ProcessData) => {
    return markedProcesses.has(process.code);
  };

  return {
    selectedProcessIndex,
    setSelectedProcessIndex,
    showArticles,
    handleChangeProcess,
    closeView,
    isProcessMarked,
  };
}
