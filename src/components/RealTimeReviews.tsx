import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

interface Review {
  id: string;
  user_id: string;
  show_id: string;
  rating: number;
  comment: string;
  created_at: string;
  users: {
    name: string;
    email: string;
  };
  shows: {
    title: string;
  };
}

export default function RealTimeReviews() {
  const { user } = useAuth();
  const { shows } = useBooking();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    show_id: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadReviews();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('reviews')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'reviews' },
        (payload) => {
          loadReviews(); // Reload all reviews to get user and show data
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadReviews = async () => {
    try {
      // Demo reviews data
      const demoReviews = [
        {
          id: '1',
          user_id: 'demo-user1',
          show_id: '1',
          rating: 5,
          comment: 'Absolutely spectacular! The cultural authenticity and powerful performances made this an unforgettable evening.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          users: { name: 'Sarah Nakimuli', email: 'sarah@demo.com' },
          shows: { title: 'The Pearl of Africa' }
        },
        {
          id: '2',
          user_id: 'demo-user2',
          show_id: '2',
          rating: 4,
          comment: 'Hilarious and entertaining! Great way to experience Kampala culture through comedy.',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          users: { name: 'David Mukasa', email: 'david@demo.com' },
          shows: { title: 'Kampala Nights' }
        },
        {
          id: '3',
          user_id: 'demo-user3',
          show_id: '3',
          rating: 5,
          comment: 'The traditional dances were mesmerizing. A beautiful celebration of our heritage.',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          users: { name: 'Grace Namatovu', email: 'grace@demo.com' },
          shows: { title: 'Ancestral Spirits' }
        }
      ];
      
      setReviews(demoReviews);
      
      // Try to load from Supabase if available
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            users!inner(name, email),
            shows!inner(title)
          `)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setReviews(data);
        }
      } catch (supabaseError) {
        console.warn('Supabase not available for reviews, using demo data:', supabaseError);
      }
    } catch (error) {
      console.warn('Failed to load reviews, using demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          show_id: newReview.show_id,
          rating: newReview.rating,
          comment: newReview.comment
        });

      if (error) throw error;

      // Log activity
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'review',
          activity_description: `Left a ${newReview.rating}-star review`,
          metadata: { show_id: newReview.show_id, rating: newReview.rating }
        });

      setNewReview({ show_id: '', rating: 5, comment: '' });
      setShowForm(false);
      // Reviews will be updated automatically via real-time subscription
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderStarSelector = (rating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`h-8 w-8 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            <Star className="h-full w-full" />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Live Reviews</h2>
        {user && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Write Review
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-amber-100 rounded-full p-2 mr-3">
                    <User className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.users.name}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <div className="text-sm text-gray-500 mt-1">{review.shows.title}</div>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            </div>

            <form onSubmit={submitReview} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Show</label>
                <select
                  value={newReview.show_id}
                  onChange={(e) => setNewReview({ ...newReview, show_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="">Select a show</option>
                  {shows.map(show => (
                    <option key={show.id} value={show.id}>{show.title}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                {renderStarSelector(newReview.rating, (rating) => 
                  setNewReview({ ...newReview, rating })
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Share your experience..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}