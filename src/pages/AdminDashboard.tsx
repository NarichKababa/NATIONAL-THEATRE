import React, { useState } from 'react';
import { BarChart3, Users, Calendar, Star, TrendingUp, DollarSign, MapPin, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'shows' | 'users'>('overview');

  // Mock data for demonstration
  const stats = {
    totalRevenue: 15750000,
    totalBookings: 1250,
    totalUsers: 3420,
    averageRating: 4.7,
    monthlyGrowth: 12.5
  };

  const recentBookings = [
    { id: '001', user: 'Sarah Nakimuli', show: 'The Pearl of Africa', amount: 50000, date: '2025-01-15' },
    { id: '002', user: 'David Mukasa', show: 'Kampala Nights', amount: 28000, date: '2025-01-15' },
    { id: '003', user: 'Grace Namatovu', show: 'Ancestral Spirits', amount: 35000, date: '2025-01-14' },
    { id: '004', user: 'Michael Ssemakula', show: 'The Pearl of Africa', amount: 40000, date: '2025-01-14' },
    { id: '005', user: 'Ruth Kisakye', show: 'Kampala Nights', amount: 22000, date: '2025-01-13' }
  ];

  const showStats = [
    { title: 'The Pearl of Africa', bookings: 450, revenue: 8500000, rating: 4.9, capacity: 85 },
    { title: 'Kampala Nights', bookings: 380, revenue: 4200000, rating: 4.6, capacity: 76 },
    { title: 'Ancestral Spirits', bookings: 420, revenue: 7050000, rating: 4.8, capacity: 82 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your theatre operations and analytics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'shows', label: 'Shows', icon: MapPin },
                { id: 'users', label: 'Users', icon: Users }
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold">UGX {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Bookings</p>
                        <p className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm">Avg Rating</p>
                        <p className="text-2xl font-bold">{stats.averageRating}</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Growth</p>
                        <p className="text-2xl font-bold">+{stats.monthlyGrowth}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                </div>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Chart Placeholder */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-64 bg-gradient-to-t from-amber-50 to-white rounded-lg flex items-end justify-center">
                      <div className="text-gray-500 text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>Revenue chart visualization would go here</p>
                      </div>
                    </div>
                  </div>

                  {/* Show Performance */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Show Performance</h3>
                    <div className="space-y-4">
                      {showStats.map((show, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{show.title}</h4>
                            <p className="text-sm text-gray-600">{show.bookings} bookings • {show.capacity}% capacity</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">UGX {(show.revenue / 1000000).toFixed(1)}M</p>
                            <div className="flex items-center text-sm text-yellow-600">
                              <Star className="h-4 w-4 mr-1 fill-current" />
                              {show.rating}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
                  <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700">
                    Export Data
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Booking ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Show</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">#{booking.id}</td>
                          <td className="py-3 px-4">{booking.user}</td>
                          <td className="py-3 px-4">{booking.show}</td>
                          <td className="py-3 px-4 font-semibold">UGX {booking.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                              Confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Shows Tab */}
            {activeTab === 'shows' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Show Management</h2>
                  <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700">
                    Add New Show
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showStats.map((show, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{show.title}</h3>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bookings:</span>
                          <span className="font-semibold">{show.bookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-semibold">UGX {(show.revenue / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-semibold">{show.capacity}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-semibold">{show.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-amber-100 text-amber-700 py-2 rounded-lg hover:bg-amber-200 text-sm font-medium">
                          Edit
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <div className="flex space-x-3">
                    <input
                      type="search"
                      placeholder="Search users..."
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700">
                      Export Users
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalUsers.toLocaleString()}</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">2,847</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">573</div>
                    <div className="text-gray-600">New This Month</div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Nakimuli', action: 'Booked tickets for The Pearl of Africa', time: '2 hours ago' },
                      { name: 'David Mukasa', action: 'Created new account', time: '4 hours ago' },
                      { name: 'Grace Namatovu', action: 'Left a 5-star review', time: '6 hours ago' },
                      { name: 'Michael Ssemakula', action: 'Updated profile information', time: '1 day ago' },
                      { name: 'Ruth Kisakye', action: 'Cancelled booking for Kampala Nights', time: '2 days ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.name}</h4>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                        <div className="text-sm text-gray-500">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}