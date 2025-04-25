"use client";

import React, { useState } from 'react';
import { MoreHorizontal, Plus, Trash2, Edit } from 'lucide-react';
import type { Board, Task, Column } from '@/types';
import TaskCard from './TaskCard';
import Modal from './custom/Modal';
import TaskForm from './TaskForm';
import Button from './custom/Button';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'; // Use community fork

interface BoardListProps {
  board: Board;
  tasks: Task[];
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (boardId: string) => void;
  onAddTask: (newTaskData: Omit<Task, 'id'>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskDragEnd: (result: DropResult) => void; // Updated type
}

const BoardList: React.FC<BoardListProps> = ({
  board,
  tasks,
  onEditBoard,
  onDeleteBoard,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onTaskDragEnd,
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null); // Track column for new task

  const openAddTaskModal = (columnId: string) => {
    setModalMode('add');
    setTaskToEdit(null);
    setTargetColumnId(columnId); // Set the target column
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setModalMode('edit');
    setTaskToEdit(task);
    setTargetColumnId(null); // Not needed for edit
    setIsTaskModalOpen(true);
  };

  const handleTaskFormSubmit = (taskData: Omit<Task, 'id'> | Task) => {
     if (modalMode === 'add' && targetColumnId) {
        // Ensure status and boardId are included for new tasks
        const newTaskData = { ...taskData, status: targetColumnId, boardId: board.id };
        onAddTask(newTaskData);
      } else if (modalMode === 'edit' && taskToEdit) {
          // Ensure boardId is retained during edit
          const updatedTaskData = { ...taskData, boardId: taskToEdit.boardId } as Task;
          onEditTask(updatedTaskData);
     }
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
    setTargetColumnId(null);
  };

  const getTasksForColumn = (columnId: string) => {
    return tasks.filter((task) => task.status === columnId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">{board.title}</h1>
        <div className="flex items-center space-x-2">
           <Button variant="outline" size="sm" onClick={() => onEditBoard(board)}>
             <Edit className="mr-2 h-4 w-4" /> Edit Board
           </Button>
           <Button variant="destructive" size="sm" onClick={() => onDeleteBoard(board.id)}>
             <Trash2 className="mr-2 h-4 w-4" /> Delete Board
           </Button>
           {/* Add more board actions if needed */}
        </div>
      </div>

      <DragDropContext onDragEnd={onTaskDragEnd}>
        <div className="flex-1 flex gap-6 pb-4">
          {board.columns.map((column, index) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-72 flex-shrink-0 rounded-lg bg-card p-3 flex flex-col ${
                    snapshot.isDraggingOver ? 'bg-secondary' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {column.title} ({getTasksForColumn(column.id).length})
                    </h2>
                    <Button
                       variant="ghost"
                       size="icon"
                       className="h-7 w-7 text-muted-foreground hover:text-foreground"
                       onClick={() => openAddTaskModal(column.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[50px]">
                    {getTasksForColumn(column.id).map((task, idx) => (
                      <Draggable key={task.id} draggableId={task.id} index={idx}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            style={{
                              ...dragProvided.draggableProps.style,
                              // Add visual feedback during drag
                              ...(dragSnapshot.isDragging && {
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                transform: `${dragProvided.draggableProps.style?.transform} rotate(3deg)`, // Slight tilt
                              }),
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={() => openEditTaskModal(task)}
                              onDelete={() => onDeleteTask(task.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                   {/* Custom Drag Placeholder */}
                    {snapshot.isDraggingOver && <div className="cdk-drag-placeholder mt-3 h-16"></div>}
                </div>
              )}
            </Droppable>
          ))}

          {/* Optionally Add New Column Button */}
          {/*
          <div className="w-72 flex-shrink-0">
            <Button variant="outline" className="w-full h-full border-dashed border-2 hover:bg-secondary">
              <Plus className="mr-2 h-4 w-4" /> New Column
            </Button>
          </div>
          */}
        </div>
      </DragDropContext>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <TaskForm
          onSubmit={handleTaskFormSubmit}
          initialData={taskToEdit}
          boardColumns={board.columns} // Pass columns for status dropdown
          mode={modalMode}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BoardList;
