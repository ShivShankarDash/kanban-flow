"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import BoardList from "@/components/BoardList";
import Modal from "@/components/custom/Modal";
import BoardForm from "@/components/BoardForm";
import Button from "@/components/custom/Button";
import type { Board, Task, Column } from "@/types";

// Sample Data (replace with API call in useEffect)
const initialBoards: Board[] = [
  {
    id: "board-1",
    title: "Project Phoenix",
    columns: [
      { id: "col-1-1", title: "To Do", boardId: "board-1" },
      { id: "col-1-2", title: "In Progress", boardId: "board-1" },
      { id: "col-1-3", title: "Done", boardId: "board-1" },
    ],
  },
  {
    id: "board-2",
    title: "Marketing Campaign",
    columns: [
      { id: "col-2-1", title: "Ideas", boardId: "board-2" },
      { id: "col-2-2", title: "Planning", boardId: "board-2" },
      { id: "col-2-3", title: "Execution", boardId: "board-2" },
      { id: "col-2-4", title: "Review", boardId: "board-2" },
    ],
  },
];

const initialTasks: Task[] = [
  { id: "task-1", title: "Setup project structure", description: "Initialize repo, install dependencies", status: "col-1-1", boardId: "board-1" },
  { id: "task-2", title: "Design UI mockups", description: "Create Figma designs", status: "col-1-1", boardId: "board-1" },
  { id: "task-3", title: "Develop API endpoints", description: "Implement CRUD for boards and tasks", status: "col-1-2", boardId: "board-1" },
  { id: "task-4", title: "Write unit tests", description: "Cover critical API functions", status: "col-1-3", boardId: "board-1" },
  { id: "task-5", title: "Brainstorm campaign slogans", description: "", status: "col-2-1", boardId: "board-2" },
  { id: "task-6", title: "Create content calendar", description: "Plan posts for next month", status: "col-2-2", boardId: "board-2" },
];


export default function Home() {
  const [boards, setBoards] = useState<Board[]>(initialBoards); // Initialize with sample data
  const [tasks, setTasks] = useState<Task[]>(initialTasks); // Initialize with sample data
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"addBoard" | "editBoard">("addBoard");
  const [boardToEdit, setBoardToEdit] = useState<Board | null>(null);

  // TODO: Replace with API calls in useEffect
  useEffect(() => {
    // Fetch boards and tasks from API
    // fetch('/api/boards').then(res => res.json()).then(data => setBoards(data));
    // fetch('/api/tasks').then(res => res.json()).then(data => setTasks(data));
    if (boards.length > 0 && !selectedBoard) {
      setSelectedBoard(boards[0]); // Select the first board by default
    }
  }, [boards, selectedBoard]); // Re-run if boards change or no board is selected

  const handleAddBoard = (newBoardData: Omit<Board, "id" | "columns"> & { columns: Omit<Column, "id" | "boardId">[] }) => {
    const newBoard: Board = {
      ...newBoardData,
      id: `board-${Date.now()}`, // Temporary ID generation
      columns: newBoardData.columns.map((col, index) => ({
        ...col,
        id: `col-${Date.now()}-${index}`,
        boardId: `board-${Date.now()}` // Needs the actual new board ID
      })),
    };
    newBoard.columns.forEach(col => col.boardId = newBoard.id); // Correctly assign boardId after board creation

    // TODO: API Call POST /api/boards
    console.log("Adding board:", newBoard);
    setBoards((prevBoards) => [...prevBoards, newBoard]);
    setSelectedBoard(newBoard); // Select the newly added board
    setIsModalOpen(false);
  };


  const handleEditBoard = (updatedBoardData: Board) => {
    // TODO: API Call PUT /api/boards/:id
    console.log("Updating board:", updatedBoardData);
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === updatedBoardData.id ? updatedBoardData : board
      )
    );
    // If the currently selected board is the one being edited, update it
    if (selectedBoard?.id === updatedBoardData.id) {
      setSelectedBoard(updatedBoardData);
    }
    setIsModalOpen(false);
    setBoardToEdit(null);
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm("Are you sure you want to delete this board and all its tasks?")) {
      // TODO: API Call DELETE /api/boards/:id
      console.log("Deleting board:", boardId);
      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
      // TODO: API Call DELETE /api/tasks?boardId=boardId
      setTasks((prevTasks) => prevTasks.filter((task) => task.boardId !== boardId));
      // If the deleted board was selected, select the first available board or null
      if (selectedBoard?.id === boardId) {
        setSelectedBoard(boards.length > 1 ? boards.find(b => b.id !== boardId) ?? boards[0] : null);
      }
    }
  };

  const openAddBoardModal = () => {
    setModalMode("addBoard");
    setBoardToEdit(null);
    setIsModalOpen(true);
  };

  const openEditBoardModal = (board: Board) => {
    setModalMode("editBoard");
    setBoardToEdit(board);
    setIsModalOpen(true);
  };

  // Task Handlers (Placeholder - to be implemented in Board component)
   const handleAddTask = (newTaskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`, // Temporary ID generation
    };
    // TODO: API Call POST /api/tasks
    console.log("Adding task:", newTask);
    setTasks((prevTasks) => [...prevTasks, newTask]);
   };

  const handleEditTask = (updatedTaskData: Task) => {
    // TODO: API Call PUT /api/tasks/:id
    console.log("Updating task:", updatedTaskData);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTaskData.id ? updatedTaskData : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
     if (window.confirm("Are you sure you want to delete this task?")) {
       // TODO: API Call DELETE /api/tasks/:id
       console.log("Deleting task:", taskId);
       setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
     }
   };

   const handleTaskDragEnd = (result: any) => {
       if (!result.destination) return; // Dropped outside a list

       const { source, destination, draggableId } = result;

       if (source.droppableId === destination.droppableId && source.index === destination.index) {
           return; // Dropped in the same place
       }

       // Update task status locally
       const updatedTasks = tasks.map(task => {
           if (task.id === draggableId) {
               return { ...task, status: destination.droppableId };
           }
           return task;
       });

       setTasks(updatedTasks);

       // TODO: API Call PUT /api/tasks/:draggableId/status
       // Body: { newStatus: destination.droppableId, boardId: selectedBoard?.id }
       // Optionally reorder tasks within the column if needed on the backend
       console.log(`Task ${draggableId} moved from ${source.droppableId} to ${destination.droppableId}`);
   };


  return (
    <div className="flex h-[calc(100vh-4rem)]"> {/* Adjust height to account for header */}
      {/* Sidebar for Boards */}
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
          All Boards ({boards.length})
        </h2>
        <nav className="flex-grow mb-4 overflow-y-auto">
          <ul>
            {boards.map((board) => (
              <li key={board.id} className="mb-1">
                <Button
                  variant={selectedBoard?.id === board.id ? "primary" : "ghost"}
                  className={`w-full justify-start text-left px-3 py-2 rounded-md ${
                    selectedBoard?.id === board.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent/10 hover:text-primary'
                  }`}
                  onClick={() => setSelectedBoard(board)}
                >
                  {board.title}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <Button variant="primary" onClick={openAddBoardModal} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Create New Board
        </Button>
      </aside>

      {/* Main Content Area for Selected Board */}
      <section className="flex-1 overflow-x-auto p-6 bg-background">
        {selectedBoard ? (
           <BoardList
              board={selectedBoard}
              tasks={tasks.filter(task => task.boardId === selectedBoard.id)}
              onEditBoard={() => openEditBoardModal(selectedBoard)}
              onDeleteBoard={handleDeleteBoard}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onTaskDragEnd={handleTaskDragEnd}
            />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-lg">
              Select a board or create a new one to get started.
            </p>
          </div>
        )}
      </section>

      {/* Add/Edit Board Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <BoardForm
          onSubmit={modalMode === 'addBoard' ? handleAddBoard : (data) => handleEditBoard(data as Board)}
          initialData={boardToEdit} // Pass null for add mode, board data for edit mode
          onCancel={() => setIsModalOpen(false)}
          mode={modalMode}
        />
      </Modal>
    </div>
  );
}
