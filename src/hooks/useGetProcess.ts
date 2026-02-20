import { useState } from "react";
import { ProcessData } from "../components/ProccessDetails";
import data from "../mocks/data.json";

const mockProcesses: ProcessData[] = data;
export function useGetProcess() {
  const [isLoading, setIsLoading] = useState(false);
  const [processes, setProcesses] = useState<ProcessData[]>(mockProcesses);

  return { isLoading, processes };
}
