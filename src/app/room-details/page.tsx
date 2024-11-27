'use client';

import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RoomResult } from '../../types/results';
import Breadcrumb from '../components/layout/breadcrumb';

export default function RoomDetails() {
  const searchParams = useSearchParams(); // Retrieve query parameters
  const id = searchParams?.get('id');;

  const [room, setRoom] = useState<RoomResult>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    // Fetch room details from API
    async function fetchRoom() {
      const response = await fetch(`/api/room/${id}/details`);
      if (response.ok) {
        const data = await response.json();
        setRoom(data);
        setIsFavorite(data.isFavorite); // Assume API provides `isFavorite` property
      }
    }

    fetchRoom();
  }, [id]);

  const toggleFavorite = async () => {
    const method = isFavorite ? 'DELETE' : 'POST';
    const response = await fetch(`/api/room/${id}/favorite`, { method });
    if (response.ok) {
      setIsFavorite(!isFavorite);
    }
  };

  const handleSendInterest = async () => {
    const response = await fetch(`/api/room/${id}/interest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: interestMessage }),
    });
    if (response.ok) {
      setShowModal(false);
      alert('Interest sent successfully!');
    } else {
      alert('Failed to send interest');
    }
  };

  const handleImageNavigation = (direction: string) => {
    if (!room?.pictures?.length) return;
    const lastIndex = room.pictures.length - 1;
    setCurrentImageIndex((prevIndex) =>
      direction === 'prev'
        ? (prevIndex === 0 ? lastIndex : prevIndex - 1)
        : (prevIndex === lastIndex ? 0 : prevIndex + 1)
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!room) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb breadcrumbs={[{ href: '/', label: '' }, { href: `/room-details?id=${room.id}`, label: 'Room Details' } ]} />
      <div className='flex gap-x-2 items-center mb-6'>
        <h1 className="text-3xl font-semibold mb-2">Room Details</h1>#{room.id}
      </div>
      {/* Pictures Gallery */}
      <div className="relative flex">
        {/* Main Image */}
        <div className="flex justify-center max-h-1/4 overflow-hidden bg-gray-200 w-full md:w-3/4 rounded-lg relative">
          {room.pictures?.length > 0 ? (
            <Image
              src={room.pictures[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              layout='contain'
              width={800}
              height={600}
              quality={100}
              className="object-cover rounded-lg w-full"
            />
          ) : (
            <p>No images available</p>
          )}
          {/* Navigation Arrows */}
          <button
            onClick={() => handleImageNavigation('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow hover:bg-gray-100 hover:opacity-20"
          >
            <ChevronLeftIcon className="h-12 w-12 text-gray-600" />
          </button>
          <button
            onClick={() => handleImageNavigation('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow hover:bg-gray-100 hover:opacity-20"
          >
            <ChevronRightIcon className="h-12 w-12 text-gray-600" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="hidden md:flex flex-col items-center ml-4 space-y-2 w-1/4">
          {room.pictures?.map((thumbnail, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-38 h-42 overflow-hidden rounded-lg border-none ${index === currentImageIndex ? 'opacity-80' : 'border-gray-300'
                }`}
            >
              <Image
                src={thumbnail}
                alt={`Thumbnail #${index + 1}`}
                width={240}
                height={140}
                quality={75}
                layout='contain'
                className='shadow-md shadow-gray-400 rounded-lg '
              />
            </button>
          ))}
        </div>
      </div>

      {/* Room Details and Owner Section */}
      <div className="flex flex-wrap mt-6">
        {/* Room Details */}
        <div className="w-full md:w-2/3 bg-white shadow rounded-lg p-4 relative">
          <h2 className="text-xl font-bold mb-2">{room.roomType}</h2>
          <div
            className="absolute top-4 right-4 text-red-500 cursor-pointer"
            onClick={toggleFavorite}
          >
            <HeartIcon className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-gray-300'}`} />
          </div>
          <ul className="space-y-2">
            <li>
              <strong>Street:</strong> {room.street}, {room.number}
            </li>
            <li>
              <strong>Rent Price:</strong> ${room.rentPrice}/month
            </li>
            <li>
              <strong>Size:</strong> {room.size} m²
            </li>
            <li>
              <strong>Availability:</strong> {room.isRented ? 'Rented' : 'Available'}
            </li>
            <li>
              <strong>Description:</strong> {room.description}
            </li>
          </ul>
        </div>

        {/* Owner Details */}
        <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Owner Information</h2>
          <ul className="space-y-2">
            <li>
              <strong>Name:</strong> {room.ownerName}
            </li>
            <li>
              <strong>City:</strong> {room.ownerCity}
            </li>
            <li>
              <strong>Phone:</strong> {room.ownerPhone}
            </li>
          </ul>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send Interest
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Send Interest</h3>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows={4}
              placeholder="Enter your message"
              value={interestMessage}
              onChange={(e) => setInterestMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInterest}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}