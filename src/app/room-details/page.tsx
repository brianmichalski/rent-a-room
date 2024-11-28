'use client';

import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RoomResult } from '../../types/results';
import Breadcrumb from '../components/layout/breadcrumb';
import { getBathroomTypeDescription, getRoomTypeDescription } from '../helper/enum.helper';
import RoomDetail from './components/room-detail';

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

  const handleImageChange = (index: number) => setCurrentImageIndex(index);

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
      <Breadcrumb breadcrumbs={[{ href: '/', label: '' }, { href: `/room-details?id=${room.id}`, label: 'Room Details' }]} />
      <div className='flex gap-x-2 items-center mb-6'>
        <h1 className="text-3xl font-semibold mb-2">Room Details</h1>#{room.id}
      </div>
      <div className='flex w-full gap-x-2'>
        <span className=" text-red-500 cursor-pointer"
          onClick={toggleFavorite}>
          <HeartIcon
            title={isFavorite ? 'Unfavorite' : 'Favorite'}
            fill={isFavorite ? 'red' : 'white'}
            fillOpacity={isFavorite ? '90%' : '80%'}
            className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-gray-300'}`} />
        </span>
        <h2 className="text-xl font-bold mb-2">{room.address}</h2>
      </div>
      <div className='flex gap-x-4'>
        {/* Pictures Gallery */}
        <div className="relative flex flex-grow max-h-96">
          <div className="relative flex flex-grow">
            {/* Main Image */}
            <div className="flex justify-center flex-grow w-full md:w-3/4 max-h-96 rounded-lg relative overflow-hidden bg-gray-200">
              {room.pictures?.length > 0 ? (
                <Image
                  src={room.pictures[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  layout='contain'
                  width={600}
                  height={400}
                  quality={100}
                  className="object-cover rounded-lg w-full"
                />
              ) : (
                <p>No images available</p>
              )}
              {/* Navigation Arrows */}
              <button
                onClick={() => handleImageNavigation('prev')}
                className="absolute left-0 sm:left-0 md:left-2 lg:left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full opacity-70 hover:opacity-100 hover:shadow hover:text-black"
              >
                <ChevronLeftIcon className="h-12 w-12 text-gray-600" />
              </button>
              <button
                onClick={() => handleImageNavigation('next')}
                className="absolute right-0 sm:right-0 md:right-2 lg:right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full opacity-70 hover:opacity-100 hover:shadow hover:text-black"
              >
                <ChevronRightIcon className="h-12 w-12 text-gray-600" />
              </button>
              <div className="absolute bottom-0 left-0 w-full flex justify-center py-2 space-x-2">
                {room.pictures.map((_, index: number) => (
                  <div
                    key={index}
                    title='Switch image'
                    onClick={() => handleImageChange(index)}
                    className={`w-2.5 h-2.5 bg-gray-400 rounded-full cursor-pointer ${index === currentImageIndex ? 'bg-yellow-500' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col items-center ml-4 space-y-2 w-36 overflow-scroll">
            {room.pictures?.map((thumbnail, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-38 h-64 rounded-lg border-none ${index === currentImageIndex ? 'opacity-80' : 'border-gray-300'
                  }`}
              >
                <Image
                  src={thumbnail}
                  alt={`Thumbnail #${index + 1}`}
                  width={240}
                  height={140}
                  quality={75}
                  layout='contain'
                  className='shadow-md shadow-gray-400 rounded-lg'
                />
              </button>
            ))}
          </div>
        </div>

        {/* Owner Details */}
        <div className="flex flex-col justify-evenly md:w-1/4 bg-gray-100 rounded-lg p-12 gap-x-4">
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
      {/* Room Details and Owner Section */}
      <div className="flex flex-wrap mt-6 gap-y-2">
        {/* Room Details */}
        <div className="w-full bg-white shadow rounded-lg p-6 relative">
          <ul className="block px-6">
            <li>
              <strong>Description</strong>
            </li>
            <li>
              {room.description}
            </li>
          </ul>
        </div>
        <div className="w-full bg-white shadow rounded-lg p-6 grid grid-cols-3 gap-y-4">
          <RoomDetail attribute='Rent Price' value={room.rentPrice} prefix='$' suffix='/month' />
          <RoomDetail attribute='Size' value={room.size} suffix='m²' />
          <RoomDetail attribute='Status' value={room.isRented ? 'Rented' : 'Available'} />
          <RoomDetail attribute='Type' value={getRoomTypeDescription(room.roomType)} />
          <RoomDetail attribute='Bathroom' value={getBathroomTypeDescription(room.bathroomType)} />
          <RoomDetail attribute='Number os Rooms' value={room.numberOfRooms} />
        </div>
      </div>

      {/* Modal Dialog */}
      {
        showModal && (
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
        )
      }
    </div >
  );
}
