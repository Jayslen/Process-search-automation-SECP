export interface ProcessData {
  institution: string;
  code: string;
  title: string;
  pubDate: string | undefined;
  dueDate: string | undefined;
  url: string;
  imagePath: string;
  timestamp?: Date;
}

export interface ProcessDetailsProps {
  processes: ProcessData[];
  markedProcesses: Set<string>;
  onToggleMark: (process: ProcessData) => void;
}

export enum Direction {
  "Next",
  "Previous",
}
