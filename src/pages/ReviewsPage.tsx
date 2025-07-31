import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  showTitle: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  isHelpful: boolean;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [selectedShow, setSelectedShow] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'helpful'>('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    showTitle: '',
    rating: 5,
    comment: ''
  });

  const reviews: Review[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Amina Katongole',
      showTitle: 'The Pearl of Africa',
      rating: 5,
      comment: 'Absolutely breathtaking performance! The way they portrayed our Ugandan heritage was both authentic and moving. The costumes, music, and acting were all top-notch. I was moved to tears multiple times. This is exactly the kind of theatre our country needs.',
      date: '2025-01-15',
      helpful: 23,
      isHelpful: false
    },
    {
      id: '2',
      userId: '2',
      userName: 'Robert Musoke',
      showTitle: 'Kampala Nights',
      rating: 4,
      comment: 'Had such a great time at this show! The humor was spot-on and really captured the essence of life in Kampala. Some songs were incredibly catchy - I\'ve been humming them all week. The only minor issue was the sound system in the second act, but overall fantastic entertainment.',
      date: '2025-01-12',
      helpful: 18,
      isHelpful: true
    },
    {
      id: '3',
      userId: '3',
      userName: 'Mary Nakato',
      showTitle: 'Ancestral Spirits',
      rating: 5,
      comment: 'This production was a spiritual experience. The traditional dances were performed with such precision and respect for our culture. My grandmother, who came with me, said it reminded her of ceremonies from her childhood. Truly exceptional preservation of our heritage.',
      date: '2025-01-10',
      helpful: 31,
      isHelpful: false
    },
    {
      id: '4',
      userId: '4',
      userName: 'John Okello',
      showTitle: 'The Pearl of Africa',
      rating: 4,
      comment: 'Great storytelling and powerful performances. The lead actress was particularly impressive - her emotional range was incredible. The set design transported us to different eras of Ugandan history. Would definitely recommend to anyone interested in our cultural stories.',
      date: '2025-01-08',
      helpful: 15,
      isHelpful: false
    },
    {
      id: '5',
      userId: '5',
      userName: 'Grace Nalwanga',
      showTitle: 'Kampala Nights',
      rating: 5,
      comment: 'Brilliant comedy that had the entire audience in stitches! The writers really understand Ugandan humor and social dynamics. It\'s rare to see such quality local content. The musical numbers were also well-choreographed. This is what Ugandan theatre should be like.',
      date: '2025-01-05',
      helpful: 27,
      isHelpful: true
    }
  ];

  const shows = ['The Pearl of Africa', 'Kampala Nights', 'Ancestral Spirits'];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    // In a real app, this would submit to an API
    console.log('New review:', newReview);
    setShowReviewForm(false);
    setNewReview({ showTitle: '', rating: 5, comment: '' });
  };

  const filteredReviews = reviews.filter(review => 
    selectedShow === 'all' || review.showTitle === selectedShow
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'newest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Overall Rating */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Rating</h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-amber-600 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                {renderStars(Math.round(averageRating), 'lg')}
                <div className="text-sm text-gray-500 mt-2">
                  Based on {reviews.length} reviews
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center text-sm">
                    <span className="w-3 text-gray-600">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current mx-1" />
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-gray-600 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Reviews</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Show</label>
                <select
                  value={selectedShow}
                  onChange={(e) => setSelectedShow(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Shows</option>
                  {shows.map(show => (
                    <option key={show} value={show}>{show}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>

            {/* Write Review Button */}
            {user && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Write a Review
              </button>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-amber-100 rounded-full p-2 mr-3">
                        <User className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <div className="text-sm text-gray-500 mt-1">{review.showTitle}</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex items-center justify-between">
                    <button className="flex items-center text-gray-500 hover:text-amber-600 text-sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Show</label>
                  <select
                    value={newReview.showTitle}
                    onChange={(e) => setNewReview({ ...newReview, showTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="">Select a show</option>
                    {shows.map(show => (
                      <option key={show} value={show}>{show}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`h-8 w-8 ${
                          star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-full w-full" />
                      </button>
                    ))}
                  </div>
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
                    onClick={() => setShowReviewForm(false)}
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
    </div>
  );
}