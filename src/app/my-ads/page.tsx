'use client'

import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '../components/breadcrumb';
import CustomDialog from '../components/modal';
import { useDeleteRoom } from './hooks/useDeleteRoom';
import { useRooms } from './hooks/useRooms';

const MyAds = () => {
  const { rooms, loading, fetchRooms } = useRooms();
  const {
    dialogOpen,
    selectedId,
    handleDeleteRoom,
    handleConfirmDelete,
    handleCancelDialog,
  } = useDeleteRoom(fetchRooms);

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
                href={'my-ads/new'}
                title="Add new room"
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
                    <th className="px-4 py-2">Room Type</th>
                    <th className="px-4 py-2">Bathroom Type</th>
                    <th className="px-4 py-2">Gender</th>
                    <th className="px-4 py-2">Rent Price</th>
                    <th className="px-4 py-2">Size (m²)</th>
                    <th className="px-4 py-2">Number of Rooms</th>
                    <th className="px-4 py-2 hidden sm:table-cell">Status</th> {/* Hidden on small screens */}
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        <Image
                          src={room.coverImageUrl}
                          alt="Room Cover"
                          width={100}
                          height={100}
                          className="rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-2">{room.roomType}</td>
                      <td className="px-4 py-2">{room.bathroomType}</td>
                      <td className="px-4 py-2">{room.gender}</td>
                      <td className="px-4 py-2">{room.rentPrice.toFixed(2)} CAD</td>
                      <td className="px-4 py-2">{room.size}</td>
                      <td className="px-4 py-2">{room.numberOfRooms}</td>
                      <td className="px-4 py-2 hidden sm:table-cell">
                        <span
                          className={`px-2 py-1 text-sm font-semibold rounded-lg ${room.isRented ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                            }`}
                        >
                          {room.isRented ? 'Rented' : 'Available'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className='flex'>
                          <Link href={`/my-ads/edit/${room.id}`} title="Edit Ad" className='crud-action'>
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
