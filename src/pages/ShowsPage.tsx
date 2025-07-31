import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function ShowsPage() {
  const { shows } = useBooking();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Current Shows</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of captivating performances celebrating Ugandan culture and artistry
          </p>
        </div>

        {/* Shows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {shows.map((show) => (
            <div key={show.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={show.image}
                    alt={show.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {show.genre}
                    </span>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">From</span>
                      <div className="text-xl font-bold text-amber-600">
                        UGX {show.price.regular.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{show.title}</h2>
                  <p className="text-gray-600 mb-4">{show.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(show.date).toLocaleDateString('en-UG', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {show.time} ({show.duration})
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {show.venue}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/booking/${show.id}`}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all text-center flex items-center justify-center"
                    >
                      Book Tickets
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    <button className="px-6 py-3 border border-amber-500 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Legend */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Seating Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
              <div>
                <h4 className="font-semibold text-gray-900">VIP Seats</h4>
                <p className="text-sm text-gray-600">Front rows with premium comfort</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Premium Seats</h4>
                <p className="text-sm text-gray-600">Excellent view and comfort</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Regular Seats</h4>
                <p className="text-sm text-gray-600">Great value for money</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}