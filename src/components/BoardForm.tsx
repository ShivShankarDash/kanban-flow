"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import type { Board, Column } from '@/types';
import Input from './custom/Input';
import Button from './custom/Button';
import Label from './custom/Label';

interface BoardFormProps {
  onSubmit: (boardData: Omit<Board, 'id'> | Board) => void;
  initialData?: Board | null;
  onCancel: () => void;
  mode: 'addBoard' | 'editBoard';
}

const BoardForm: React.FC<BoardFormProps> = ({ onSubmit, initialData, onCancel, mode }) => {
  const [title, setTitle] = useState('');
  // Use Omit<Column, 'id' | 'boardId'> for new columns
  const [columns, setColumns] = useState<(Column | Omit<Column, 'id' | 'boardId'>)[]>([]);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [columnErrors, setColumnErrors] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (mode === 'editBoard' && initialData) {
      setTitle(initialData.title);
      setColumns(initialData.columns || [{ title: 'To Do' }, { title: 'In Progress' }, { title: 'Done' }]); // Provide defaults if needed
    } else {
      // Default columns for add mode
      setTitle('');
      setColumns([{ title: 'To Do' }, { title: 'In Progress' }, { title: 'Done' }]);
    }
    setTitleError(null);
    setColumnErrors([]);
  }, [initialData, mode]);

  const validate = (): boolean => {
    let isValid = true;
    setTitleError(null);
    setColumnErrors(new Array(columns.length).fill(null)); // Reset column errors

    if (!title.trim()) {
      setTitleError('Board name cannot be empty.');
      isValid = false;
    }

    const newColumnErrors = columns.map((col, index) => {
      if (!col.title.trim()) {
        return 'Column name cannot be empty.';
      }
      // Check for duplicate column names (case-insensitive)
      if (columns.some((otherCol, otherIndex) => index !== otherIndex && otherCol.title.trim().toLowerCase() === col.title.trim().toLowerCase())) {
        return 'Column names must be unique.';
      }
      return null;
    });

    if (newColumnErrors.some(error => error !== null)) {
      setColumnErrors(newColumnErrors);
      isValid = false;
    }
     if (columns.length === 0) {
       // Or handle this differently, maybe add a general error
       console.warn("Board must have at least one column");
       // Optionally set a general error message here
       isValid = false;
     }


    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const boardData = {
        title: title.trim(),
        // Filter out columns without titles (though validation should prevent this)
        // Ensure columns are in the correct format for submit
        columns: columns.filter(col => col.title.trim()).map(col => ({ title: col.title.trim() })),
      };

      if (mode === 'editBoard' && initialData) {
          // For editing, merge existing IDs with potentially new/edited columns
          const finalColumns = columns.map((col) => {
              if ('id' in col) { // It's an existing column being edited
                  return { id: col.id, title: col.title.trim(), boardId: col.boardId };
              } else { // It's a new column added during edit
                  // Backend will assign ID, just send title
                  // Or generate temporary client-side ID if needed for immediate UI update before backend confirmation
                  return { title: col.title.trim() }; // Simplified for now
              }
          });

        onSubmit({ ...initialData, title: title.trim(), columns: finalColumns as Column[] }); // Pass the full board object with ID for edit
      } else {
        // For adding, pass only title and column titles (without IDs)
         onSubmit({ title: title.trim(), columns: columns.map(col => ({ id: 'temp-id', boardId: 'temp-boardId', title: col.title.trim() })) });
      }
    }
  };

  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], title: value }; // Update title
    setColumns(newColumns);
    // Optionally clear the specific column error on change
    const newColumnErrors = [...columnErrors];
    newColumnErrors[index] = null;
    setColumnErrors(newColumnErrors);
  };

  const addColumn = () => {
    setColumns([...columns, { title: '' }]); // Add new column object without ID
    setColumnErrors([...columnErrors, null]); // Add space for potential error
  };

  const removeColumn = (index: number) => {
    // Prevent removing the last column if desired
    // if (columns.length <= 1) {
    //   // Optionally show a message
    //   return;
    // }
    const newColumns = columns.filter((_, i) => i !== index);
    const newColumnErrors = columnErrors.filter((_, i) => i !== index);
    setColumns(newColumns);
    setColumnErrors(newColumnErrors);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <h2 className="text-lg font-semibold mb-4">
        {mode === 'addBoard' ? 'Add New Board' : 'Edit Board'}
      </h2>

      <div className="space-y-2">
        <Label htmlFor="boardName">Board Name</Label>
        <Input
          id="boardName"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError(null); // Clear error on change
          }}
          placeholder="e.g. Web Design"
          className={titleError ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}
          aria-invalid={!!titleError}
          aria-describedby={titleError ? "title-error" : undefined}
        />
        {titleError && <p id="title-error" className="text-xs text-destructive mt-1">{titleError}</p>}
      </div>

      <div className="space-y-2">
        <Label>Board Columns</Label>
        {columns.length === 0 && <p className="text-sm text-muted-foreground">Add at least one column.</p>}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {columns.map((column, index) => (
            <div key={'id' in column ? column.id : `new-${index}`} className="flex items-center space-x-2">
              <Input
                type="text"
                value={column.title}
                onChange={(e) => handleColumnChange(index, e.target.value)}
                placeholder="e.g. To Do"
                className={`flex-grow ${columnErrors[index] ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                aria-invalid={!!columnErrors[index]}
                aria-describedby={columnErrors[index] ? `column-error-${index}` : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeColumn(index)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove column ${column.title || index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {columnErrors.map((error, index) => error && (
            <p key={`err-${index}`} id={`column-error-${index}`} className="text-xs text-destructive mt-1 pl-1">{error}</p>
          ))}
        </div>
         <Button type="button" variant="secondary" onClick={addColumn} className="w-full mt-2">
           <Plus className="mr-2 h-4 w-4" /> Add New Column
         </Button>
      </div>


      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {mode === 'addBoard' ? 'Create Board' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default BoardForm;
