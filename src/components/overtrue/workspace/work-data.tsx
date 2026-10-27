import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import {
  tasks as initialTasks,
  projects as initialProjects,
  clients as initialClients,
} from "@/data/workspace/studio";
import { approvalRequests } from "@/data/workspace/operations";
import type { ApprovalRequest } from "@/registry/overtrue/approval-queue";

export type WorkTask = (typeof initialTasks)[number];
export type WorkProject = (typeof initialProjects)[number] & { brief?: string };
export type WorkClient = (typeof initialClients)[number];
const WorkData = createContext<{
  tasks: WorkTask[];
  setTasks: Dispatch<SetStateAction<WorkTask[]>>;
  approvals: ApprovalRequest[];
  setApprovals: Dispatch<SetStateAction<ApprovalRequest[]>>;
  projects: WorkProject[];
  setProjects: Dispatch<SetStateAction<WorkProject[]>>;
  clients: WorkClient[];
  setClients: Dispatch<SetStateAction<WorkClient[]>>;
} | null>(null);

/** Demo records live for this workspace session, including navigation between views. */
export function WorkDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [approvals, setApprovals] = useState(approvalRequests);
  const [projects, setProjects] = useState<WorkProject[]>(initialProjects);
  const [clients, setClients] = useState(initialClients);
  return (
    <WorkData.Provider
      value={{
        tasks,
        setTasks,
        approvals,
        setApprovals,
        projects,
        setProjects,
        clients,
        setClients,
      }}
    >
      {children}
    </WorkData.Provider>
  );
}
export function useWorkData() {
  const value = useContext(WorkData);
  // Extracted card previews also work independently of the workspace shell.
  const [tasks, setTasks] = useState(initialTasks);
  const [approvals, setApprovals] = useState(approvalRequests);
  const [projects, setProjects] = useState<WorkProject[]>(initialProjects);
  const [clients, setClients] = useState(initialClients);
  return (
    value ?? {
      tasks,
      setTasks,
      approvals,
      setApprovals,
      projects,
      setProjects,
      clients,
      setClients,
    }
  );
}
