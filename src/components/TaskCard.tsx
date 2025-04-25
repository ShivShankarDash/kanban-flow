import React from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import type { Task } from '@/types';
import Button from './custom/Button'; // Use custom Button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming shadcn dropdown is okay, or replace with custom later

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-background p-3 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-foreground break-words">{task.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Task</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground break-words">{task.description}</p>
      )}
      {/* Add subtasks count or other indicators if needed */}
    </div>
  );
};

export default TaskCard;
