"use client";

import React, { useState, useEffect } from 'react';
import type { Task, Column } from '@/types';
import Input from './custom/Input';
import Textarea from './custom/Textarea';
import Button from './custom/Button';
import Label from './custom/Label';
import Select from './custom/Select'; // Using custom Select

interface TaskFormProps {
  onSubmit: (taskData: Omit<Task, 'id'> | Task) => void;
  initialData?: Task | null;
  boardColumns: Column[]; // Pass columns for status selection
  onCancel: () => void;
  mode: 'add' | 'edit';
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, boardColumns, onCancel, mode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(''); // Store column ID
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setStatus(initialData.status);
    } else {
      // Set default status to the first column when adding a new task
      setTitle('');
      setDescription('');
      setStatus(boardColumns.length > 0 ? boardColumns[0].id : ''); // Default to first column ID if available
    }
    setTitleError(null);
  }, [initialData, mode, boardColumns]);

  const validate = (): boolean => {
    let isValid = true;
    setTitleError(null);

    if (!title.trim()) {
      setTitleError('Task title cannot be empty.');
      isValid = false;
    }
    // Add more validation if needed (e.g., description length)
    if (!status) {
        console.error("Task status (column) is required.");
        // Optionally set an error state for the status field
        isValid = false;
    }


    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status: status,
        boardId: boardColumns.find(column => column.id === status)?.boardId || '', // Ensure boardId is included
      };

      if (mode === 'edit' && initialData) {
        onSubmit({ ...initialData, ...taskData }); // Submit full task object with ID for edit
      } else {
        onSubmit(taskData); // Submit partial task object for add
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <h2 className="text-lg font-semibold mb-4">
        {mode === 'add' ? 'Add New Task' : 'Edit Task'}
      </h2>

      <div className="space-y-2">
        <Label htmlFor="taskTitle">Title</Label>
        <Input
          id="taskTitle"
          type="text"
          value={title}
          onChange={(e) => {
             setTitle(e.target.value);
             if (titleError) setTitleError(null);
          }}
          placeholder="e.g. Take coffee break"
          className={titleError ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}
          aria-invalid={!!titleError}
          aria-describedby={titleError ? "task-title-error" : undefined}
        />
        {titleError && <p id="task-title-error" className="text-xs text-destructive mt-1">{titleError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="taskDescription">Description</Label>
        <Textarea
          id="taskDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          rows={4}
        />
        {/* Add description validation message if needed */}
      </div>

       <div className="space-y-2">
         <Label htmlFor="taskStatus">Status</Label>
         <Select
           id="taskStatus"
           value={status}
           onValueChange={(value) => setStatus(value)}
         >
            {/* <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger> */}
             {boardColumns.length > 0 ? (
               boardColumns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
               ))
             ) : (
                 <option value="" disabled>No columns available</option>
             )}
         </Select>
          {!status && mode === 'add' && <p className="text-xs text-destructive mt-1">Please select a status.</p>} {/* Basic validation hint */}
       </div>


      {/* Add subtasks section if needed */}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {mode === 'add' ? 'Create Task' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
