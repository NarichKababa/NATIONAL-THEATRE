import React, { useState } from 'react';
import { User, Calendar, Clock, MapPin, CreditCard, Edit3, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function ProfilePage() {
  const { user, logout, deleteAccount } = useAuth();
  const { bookings } = useBooking();
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'preferences'>('bookings');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your profile</h2>
        </div>
      </div>
    );
  }

  // Mock booking data for demonstration
  const userBookings = [
    {
      id: '1',
      showTitle: 'The Pearl of Africa',
      date: '2025-02-15',
      time: '19:30',
      venue: 'Main Theatre',
      seats: ['A5', 'A6'],
      totalAmount: 100000,
      status: 'confirmed' as const,
      bookingDate: '2025-01-10'
    },
    {
      id: '2',
      showTitle: 'Kampala Nights',
      date: '2025-02-20',
      time: '20:00',
      venue: 'Studio Theatre',
      seats: ['C12'],
      totalAmount: 28000,
      status: 'confirmed' as const,
      bookingDate: '2025-01-08'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-full p-4 mr-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold mt-1">
                  {user.role === 'admin' ? 'Administrator' : 'Theatre Enthusiast'}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 font-medium"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium"
              >
                Delete Account
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'bookings', label: 'My Bookings', icon: Calendar },
                { id: 'profile', label: 'Profile Settings', icon: User },
                { id: 'preferences', label: 'Preferences', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-amber-500 text-amber-600 bg-amber-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                  <div className="text-sm text-gray-500">
                    {userBookings.length} booking{userBookings.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                          <div className="flex-1 mb-4 lg:mb-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{booking.showTitle}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(booking.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {booking.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {booking.venue}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm text-gray-500">Seats: </span>
                                <span className="font-medium">{booking.seats.join(', ')}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-amber-600">
                                  UGX {booking.totalAmount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">You haven't booked any shows yet. Explore our current productions!</p>
                    <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700">
                      Browse Shows
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <div className="max-w-2xl">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+256 XXX XXX XXX"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <select
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50"
                      >
                        <option value="kampala">Kampala</option>
                        <option value="entebbe">Entebbe</option>
                        <option value="jinja">Jinja</option>
                        <option value="mbarara">Mbarara</option>
                        <option value="gulu">Gulu</option>
                      </select>
                    </div>
                    {isEditing && (
                      <div className="flex space-x-4">
                        <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700">
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-amber-600" defaultChecked />
                        <span className="ml-3 text-gray-700">Email notifications for new shows</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-amber-600" defaultChecked />
                        <span className="ml-3 text-gray-700">Booking confirmations and reminders</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-amber-600" />
                        <span className="ml-3 text-gray-700">Special offers and promotions</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Cultural Drama', 'Musical Comedy', 'Traditional Dance', 'Contemporary Theatre', 'Children\'s Shows'].map((genre) => (
                        <button
                          key={genre}
                          className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200"
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Preference</h3>
                    <select className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="en">English</option>
                      <option value="ug">Luganda</option>
                      <option value="sw">Swahili</option>
                    </select>
                  </div>

                  <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone. 
                Your bookings and reviews will be preserved for record-keeping purposes.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (deleteAccount) {
                      const success = await deleteAccount();
                      if (success) {
                        alert('Account deleted successfully');
                      } else {
                        alert('Failed to delete account');
                      }
                    }
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}