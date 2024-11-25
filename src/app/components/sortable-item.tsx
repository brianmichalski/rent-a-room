import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface SortableItemProps {
  id: string;
  url: string;
  onRemoveClick: (id: string) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, url, onRemoveClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (event: React.MouseEvent) => {
    onRemoveClick(id);  // Call the onRemoveClick function passed down as a prop
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative w-full"
    >
      <Image
        src={url}
        layout="responsive"
        width={4} // Aspect ratio
        height={3}
        objectFit="cover"
        alt="Image"
        className="rounded-lg"
      />
      <div className="absolute top-2 right-2 flex flex-col space-y-2">
        <button
          onMouseDown={(e) => handleClick(e)}
          className="text-white bg-black opacity-50 p-1 rounded-full hover:opacity-75"
        >
          <TrashIcon width={16} />
        </button>
      </div>
    </div>
  );
};
