export interface Task {
    id: string;
    title: string;
    description?: string;
    status: string; // Corresponds to Column ID
    boardId: string;
    // subtasks?: Subtask[]; // Optional: Add subtasks later if needed
  }
  
  // export interface Subtask {
  //   id: string;
  //   title: string;
  //   isCompleted: boolean;
  // }
  
  export interface Column {
    id: string;
    title: string;
    boardId: string; // Link back to the board
    // tasks?: Task[]; // Tasks are usually fetched separately based on boardId and status/columnId
  }
  
  export interface Board {
    id: string;
    title: string;
    columns: Column[];
  }
  