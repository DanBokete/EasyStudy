import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

function Board({ children, id }: { children: ReactNode; id: string }) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });
    const style = {
        color: isOver ? "green" : undefined,
    };

    return (
        <div className="bg-amber-100 w-40 h-80" ref={setNodeRef} style={style}>
            {children}
        </div>
    );
}

export default Board;
