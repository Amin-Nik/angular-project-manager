export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignTo: string;
  priority: string;
  label: string;
  duration: string;
}
