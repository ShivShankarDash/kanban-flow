"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { ChevronRight } from 'lucide-react'; // Assuming lucide-react is okay
import { cn } from '@/lib/utils';
import Button from '@/components/custom/Button'; // Use custom Button

// Basic context for managing open state
interface DropdownContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DropdownContext = createContext<DropdownContextProps | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownMenu');
  }
  return context;
};

// Root component
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
};

// Trigger component
const DropdownMenuTrigger = ({ children, asChild = false, ...props }: { children: React.ReactNode, asChild?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { isOpen, setIsOpen } = useDropdown();
  const TriggerElement = asChild ? React.Fragment : (asChild ? Button : 'button'); // Use custom button if needed or default

   const triggerProps = {
       onClick: () => setIsOpen(!isOpen),
       'aria-haspopup': 'menu' as 'menu',
       'aria-expanded': isOpen,
       ...props, // Spread remaining props
   };

   // If using Slot (asChild), clone the child with props. Otherwise, render the button.
   if (asChild && React.isValidElement(children)) {
       return React.cloneElement(children, triggerProps);
   }

  return <TriggerElement {...triggerProps}>{children}</TriggerElement>;
};

// Content component
const DropdownMenuContent = ({ children, className, align = 'start', sideOffset = 4, ...props }: { children: React.ReactNode, className?: string, align?: 'start' | 'center' | 'end', sideOffset?: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const { isOpen, setIsOpen } = useDropdown();
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const alignmentClasses = {
    start: 'origin-top-left left-0',
    center: 'origin-top left-1/2 transform -translate-x-1/2',
    end: 'origin-top-right right-0',
  };

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none animate-fade-in', // Basic fade-in
        alignmentClasses[align],
        className
      )}
       style={{ marginTop: `${sideOffset}px` }} // Apply sideOffset
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
      {...props}
    >
      {children}
    </div>
  );
};

// Item component
const DropdownMenuItem = ({ children, className, onSelect, ...props }: { children: React.ReactNode, className?: string, onSelect?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { setIsOpen } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (props.onClick) props.onClick(e);
        if (onSelect) onSelect();
        if (!props.disabled) {
            setIsOpen(false); // Close menu on item click unless disabled
        }
    };

  return (
    <button
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left',
        className
      )}
      role="menuitem"
      tabIndex={-1}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Separator component
const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />;
};

// Label component (non-interactive)
const DropdownMenuLabel = ({ children, className, ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('px-2 py-1.5 text-sm font-semibold text-muted-foreground', className)} {...props}>
      {children}
    </div>
  );
};


// Add other components like CheckboxItem, RadioGroup, RadioItem, Submenu etc. if needed,
// following a similar pattern of basic HTML/CSS and state management.

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  // Export others as they are created
};
