# KanbanFlow - Project Management App

KanbanFlow is a simple, interactive Kanban board application built with Next.js and React. It allows users to manage projects by organizing tasks into customizable boards and columns.

## Features

*   **Board Management:**
    *   Create new boards with custom names and columns.
    *   View a list of all available boards.
    *   Select a board to view its columns and tasks.
    *   Edit existing board names and column structures.
    *   Delete boards (including all associated tasks).
*   **Task Management:**
    *   Add new tasks to specific columns within a board, including a title and optional description.
    *   Edit existing task details (title, description, status/column).
    *   Delete individual tasks.
*   **Interactive UI:**
    *   **Drag and Drop:** Move tasks between columns within the selected board using drag-and-drop functionality (`@hello-pangea/dnd`).
    *   **Modals:** Use modal dialogs for creating and editing boards and tasks, providing a focused user experience.
    *   **Responsive Placeholders:** The layout adapts based on whether a board is selected.
    *   **State Management:** Utilizes React Hooks (`useState`, `useEffect`) for managing application state (boards, tasks, selected board, modal visibility).
    *   **Visual Feedback:** Hover states on interactive elements (buttons, links, task cards) and visual cues during drag-and-drop.
*   **Styling:**
    *   Clean, modern UI styled with **Tailwind CSS**.


## Web Experience Overview




https://github.com/user-attachments/assets/b16d8f5b-3ba1-4ef4-b4e3-214f242df165




    

## Thought Process & Design Decisions

1.  **Framework Choice (Next.js & React):** Next.js provides a robust framework for building React applications, offering features like server components (though currently using client components `"use client";`), file-based routing (App Router structure), and API routes, making it suitable for full-stack development. React's component model facilitates building a modular and maintainable UI.

2.  **Component-Based Architecture:** The application is broken down into reusable components (`BoardList`, `TaskCard`, `BoardForm`, `TaskForm`, `Modal`, custom `Button`, `Input`, etc.). This promotes code reuse, separation of concerns, and easier maintenance. Custom components (`custom/`) were built to adhere to the "no external component library" constraint while maintaining a consistent look and feel.

3.  **State Management (React Hooks):** For this application's current scope, React's built-in hooks (`useState`, `useEffect`) are sufficient for managing the state of boards, tasks, selected items, and UI states like modal visibility. This avoids the overhead of larger state management libraries for now. State is primarily managed in the main `page.tsx` and passed down as props.

4.  **API Design (Placeholder):** Next.js API routes (`src/app/api/[[...route]]/route.ts`) are used as placeholders for the backend. This allows for easy integration within the Next.js application structure.

5.  **Styling (Tailwind CSS & Custom Theme):** Tailwind CSS is used for utility-first styling, enabling rapid UI development and ensuring consistency. A custom theme is defined in `globals.css` using HSL CSS variables, allowing easy modification of the color scheme (background, foreground, primary, accent, etc.) to match the design requirements.

6.  **User Experience:**
    *   Modals are used for forms (adding/editing boards/tasks) to avoid cluttering the main interface and provide a focused workflow.
    *   Frontend validation is included in forms to provide immediate feedback to the user.
    *   Confirmation dialogs (`window.confirm`) are used for destructive actions like deletion.
    *   Visual feedback on hover and during drag operations enhances usability.

7.  **Data Flow:** The main page component fetches (or initializes) data and passes it down to child components. Callbacks (`onAddTask`, `onDeleteBoard`, etc.) are passed down to allow child components to trigger actions that update the state in the parent component. This follows a standard unidirectional data flow pattern in React.

## Future Considerations

*   **Real-time Updates:** Implement real-time updates (e.g., using WebSockets) if multiple users collaborate.
*   **Advanced Features:** Add subtasks, due dates, task assignments, search/filtering, etc.
*   **Error Handling:** Implement more robust error handling, potentially using a dedicated notification/toast system instead of `window.alert` or `console.log`.
*   **Testing:** Add unit and integration tests.
