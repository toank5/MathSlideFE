
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableCanvasProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const DroppableCanvas = ({ children, className, onClick }: DroppableCanvasProps) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div ref={setNodeRef} className={className} onClick={onClick}>
      {children}
    </div>
  );
};
