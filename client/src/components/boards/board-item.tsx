import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function BoardItem() {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: "draggable",
    });

    const style = transform
        ? {
              transform: CSS.Translate.toString(transform),
          }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            BoardItem
        </div>
    );
}

export default BoardItem;
