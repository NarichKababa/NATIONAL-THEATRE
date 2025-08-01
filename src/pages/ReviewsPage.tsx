import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RealTimeReviews from '../components/RealTimeReviews';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Audience Reviews</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our audiences are saying about their theatre experiences
          </p>
        </div>

        <RealTimeReviews />
      </div>
    </div>
  );
}