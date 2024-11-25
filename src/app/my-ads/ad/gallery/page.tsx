"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Breadcrumb from "../../../components/breadcrumb";
import { SortableItem } from "../../../components/sortable-item";

interface Image {
  id: number;
  url: string;
  order: number;
}

const PictureGalleryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const roomId = Number(searchParams?.get("roomId"));

  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadImages = () => {
    fetch(`/api/room/${roomId}/picture`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.sort((a: Image, b: Image) => a.order - b.order));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching images", err);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    // Fetch images from the API when the page is loaded
    if (roomId) {
      loadImages();
    }
  }, [roomId]);

  // Handle file drop or file select
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const formData = new FormData();
      formData.append("roomId", roomId.toString());
      for (const file of acceptedFiles) {
        formData.append("file", file);
      }

      fetch("/api/room-picture", {
        method: "POST",
        body: formData,
      })
        .then((success) => {
          if (success) {
            loadImages();
          }
        })
        .catch((error) => console.error("Error uploading image:", error));
    },
    accept: { "image/*": [] },
  });

  // Drag-and-drop sensors for mouse and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === Number(active.id));
      const newIndex = images.findIndex((img) => img.id === Number(over?.id));

      const reorderedImages = arrayMove(images, oldIndex, newIndex);

      setImages(reorderedImages);

      // Update order on the backend
      reorderedImages.forEach((image, index) => {
        fetch(`/api/room-picture/${image.id}/order`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order: index + 1 }),
        }).catch((err) => console.error("Error updating order:", err));
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Send delete request to the server
      const response = await fetch(`/api/room-picture/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the image.');
      }

      // Once the image is successfully deleted, update the state to remove it
      setImages((prev) => prev.filter((img) => img.id.toString() !== id));

    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <Breadcrumb
        breadcrumbs={[
          { href: "/", label: "" },
          { href: "/my-ads", label: "My Ads" },
          { href: "/my-ads/ad", label: "New" },
        ]}
      />
      <div className="flex gap-x-2 items-center mb-6">
        <Link href={"/my-ads/"} title="Go back" className="p-2 hover:bg-gray-100">
          <ChevronLeftIcon className="text-blue-600" width={24} />
        </Link>
        <h1 className="text-3xl font-semibold">Ad Gallery</h1>
        <span className="text-gray-500">#{roomId}</span>
      </div>

      <div
        {...getRootProps()}
        className="w-full h-60 border-4 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center mb-6"
      >
        <input {...getInputProps()} />
        <p className="text-lg text-gray-500">Drag & Drop or Click on this area to browse and upload images</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((image) => image.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <p>Loading images...</p>
            ) : (
              images.map((image) => (
                <SortableItem key={image.id} id={image.id.toString()} url={image.url} onRemoveClick={handleDelete} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PictureGalleryPage;
