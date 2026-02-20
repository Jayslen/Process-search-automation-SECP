import { useState } from "react";
import data from "../mocks/data.json";
import { ProcessData } from "../types/core";

const mockProcesses: ProcessData[] = data;
export function useGetProcess() {
  const [isLoading, setIsLoading] = useState(false);
  const [processes, setProcesses] = useState<ProcessData[]>(mockProcesses);

  return { isLoading, processes };
}
