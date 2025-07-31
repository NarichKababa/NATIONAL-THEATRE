import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Star, ArrowRight, Users, Award, Heart } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function HomePage() {
  const { shows } = useBooking();
  const featuredShows = shows.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-amber-900 via-orange-800 to-red-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg)'
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Experience the Magic of
            <span className="block text-amber-300">Ugandan Theatre</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Immerse yourself in captivating stories, rich culture, and world-class performances at Uganda's premier theatre destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shows"
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Book Your Tickets
            </Link>
            <Link
              to="/artists"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
            >
              Meet Our Artists
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50K+</h3>
              <p className="text-gray-600">Happy Audiences</p>
            </div>
            <div className="p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">200+</h3>
              <p className="text-gray-600">Productions</p>
            </div>
            <div className="p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">25</h3>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
            <div className="p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.9</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shows */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Shows</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and critically acclaimed performances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredShows.map((show) => (
              <div key={show.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="relative h-64">
                  <img
                    src={show.image}
                    alt={show.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {show.genre}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{show.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{show.description}</p>
                  
                  <div className="space-y-2 mb-4">
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
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">From</span>
                      <span className="text-xl font-bold text-amber-600 ml-1">
                        UGX {show.price.regular.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      to={`/booking/${show.id}`}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center"
                    >
                      Book Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/shows"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold text-lg"
            >
              View All Shows
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Uganda National Theatre</h2>
              <p className="text-lg text-gray-600 mb-6">
                For over 25 years, Uganda National Theatre has been the beating heart of the country's performing arts scene. We celebrate the rich tapestry of Ugandan culture while embracing contemporary artistic expression.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our mission is to provide a platform for local and international artists to showcase their talents, preserve our cultural heritage, and inspire future generations through the transformative power of theatre.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Award Winning</h4>
                    <p className="text-sm text-gray-600">Excellence in Arts</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Community First</h4>
                    <p className="text-sm text-gray-600">Supporting Local Artists</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg"
                alt="Theatre Performance"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}