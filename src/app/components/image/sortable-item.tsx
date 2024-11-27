import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import LoadingImage from "./loading-image";

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
    onRemoveClick(id);
  };

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative w-full items-center block ${isLoading ? 'bg-gray-200 rounded-md' : ''}`}
    >
      <LoadingImage isLoading={isLoading} />
      <Image
        src={url}
        layout="contain"
        width={360} // Aspect ratio
        height={100}
        quality={75}
        objectFit="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        title="Drag and Drop the picture to change its order"
        alt="Image"
        className="rounded-lg hover:opacity-70 hover:cursor-grab active:cursor-grabbing"
      />
      <div className="absolute top-2 right-2 flex flex-col space-y-2">
        <button
          onMouseDown={(e) => handleClick(e)}
          title="Remove picture"
          className="text-white bg-black opacity-50 p-1 rounded-full hover:bg-red-500 hover:opacity-100 hover"
        >
          <TrashIcon width={16} />
        </button>
      </div>
    </div>
  );
};
