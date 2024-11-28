'use client';

import { LockClosedIcon, LockOpenIcon, PencilSquareIcon, PhotoIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '../components/layout/breadcrumb';
import CustomDialog from '../components/layout/modal';
import { getBathroomTypeDescription, getGenderDescription, getRoomTypeDescription } from '../helper/enum.helper';
import { useChangeRoomAvailability } from './hooks/useChangeRoomAvailability';
import { useDeleteRoom } from './hooks/useDeleteRoom';
import { useRooms } from './hooks/useRooms';

const MyAds = () => {
  const { rooms, loading, fetchRooms, setRooms } = useRooms();
  const {
    dialogOpen,
    handleDeleteRoom,
    handleConfirmDelete,
    handleCancelDialog,
  } = useDeleteRoom(fetchRooms);

  const {
    handleChangeRoomAvailability,
  } = useChangeRoomAvailability(setRooms); // Pass setRooms to the hook

  return (
    <>
      <CustomDialog
        isOpen={dialogOpen}
        onClose={handleCancelDialog}
        title="Delete Ad"
        message="Are you sure you want to delete this ad?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDialog}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb breadcrumbs={[{ href: '/', label: '' }, { href: '/my-ads', label: 'My Ads' }]} />
        <h1 className="text-3xl font-semibold mb-6">My Ads</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="w-full flex mb-6">
              <Link
                href={'my-ads/ad'}
                title="New Ad"
                className="p-3 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                <PlusCircleIcon width={24} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-700">
                    <th className="px-4 py-2">Cover</th>
                    <th className="px-4 py-2 hidden sm:table-cell">Status</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">Rent Price</th>
                    <th className="px-4 py-2 hidden sm:table-cell">Size (m²)</th>
                    <th className="px-4 py-2 hidden sm:table-cell">Number of Rooms</th>
                    <th className="px-4 py-2 hidden sm:table-cell">Other</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="h-24 border-b border-gray-200">
                      <td className="px-4 py-2">
                        <Link title='Go to room details page' href={`/room-details?id=${room.id}`}>
                          {room.coverImageUrl
                            ? <Image
                              src={room.coverImageUrl}
                              alt="Ad Cover"
                              quality={50}
                              layout='contain'
                              width={100}
                              height={50}
                              className="rounded-lg"
                            />
                            : 'No images'}
                        </Link>
                      </td>
                      <td className="px-4 py-2 hidden sm:table-cell">
                        <span
                          className={`px-2 py-1 text-sm font-semibold rounded-lg
                          ${room.isRented ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'}`}>
                          {room.isRented ? 'Rented' : 'Available'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{room.address}</td>
                      <td className="px-4 py-2">{room.rentPrice.toFixed(2)} CAD</td>
                      <td className="px-4 py-2 hidden sm:table-cell text-center">{room.size}</td>
                      <td className="px-4 py-2 hidden sm:table-cell text-center">{room.numberOfRooms}</td>
                      <td className="px-4 py-2 border-b text-sm hidden sm:table-cell">
                        <div className="grid grid-cols-2">
                          <span>Type:</span><span>{getRoomTypeDescription(room.roomType)}</span>
                          <span>Bathroom:</span><span>{getBathroomTypeDescription(room.bathroomType)}</span>
                          <span>Gender:</span><span>{getGenderDescription(room.gender)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className='flex'>
                          <Link href={`/my-ads/ad/gallery?roomId=${room.id}`} title="Edit Gallery" className='crud-action'>
                            <PhotoIcon width={24} />
                          </Link>
                          <button onClick={() => handleChangeRoomAvailability(room.id)}
                            title={room.isRented ? 'Mark as Available' : 'Mark as Rented'}
                            className='crud-action'>
                            {room.isRented
                              ? <LockOpenIcon width={24} />
                              : <LockClosedIcon width={24} />
                            }
                          </button>
                          <Link href={`/my-ads/ad?id=${room.id}`} title="Edit Ad" className='crud-action'>
                            <PencilSquareIcon width={24} />
                          </Link>
                          <button onClick={() => handleDeleteRoom(room.id)} title="Remove Ad" className='crud-action'>
                            <TrashIcon width={24} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyAds;
