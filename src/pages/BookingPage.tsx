import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import BookingItems from '../components/BookingItems';

export default function BookingPage() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    shows, 
    seats, 
    selectedSeats, 
    selectedItems,
    initializeSeats, 
    selectSeat, 
    deselectSeat, 
    confirmBooking,
    getShowById 
  } = useBooking();
  
  const [bookingStage, setBookingStage] = useState<'seats' | 'payment' | 'confirmation'>('seats');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const show = getShowById(showId!);

  useEffect(() => {
    if (showId) {
      initializeSeats(showId);
    }
  }, [showId, initializeSeats]);

  if (!show) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Show not found</h2>
          <button
            onClick={() => navigate('/shows')}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
          >
            Back to Shows
          </button>
        </div>
      </div>
    );
  }

  const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const itemsTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = seatsTotal + itemsTotal;

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || !seat.isAvailable) return;

    if (seat.isSelected) {
      deselectSeat(seatId);
    } else {
      selectSeat(seatId);
    }
  };

  const handleBookingConfirmation = async () => {
    if (!user) {
      alert('Please login to complete your booking');
      return;
    }

    setIsProcessing(true);
    try {
      const success = await confirmBooking(showId!, user.id);
      if (success) {
        setBookingSuccess(true);
        setBookingStage('confirmation');
      }
    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeatColor = (seat: any) => {
    if (!seat.isAvailable) return 'bg-gray-300 cursor-not-allowed';
    if (seat.isSelected) return 'bg-amber-500 text-white';
    
    switch (seat.type) {
      case 'vip': return 'bg-purple-200 hover:bg-purple-300 cursor-pointer';
      case 'premium': return 'bg-blue-200 hover:bg-blue-300 cursor-pointer';
      case 'regular': return 'bg-green-200 hover:bg-green-300 cursor-pointer';
      default: return 'bg-gray-200';
    }
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, typeof seats>);

  if (bookingStage === 'confirmation' && bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your tickets for "{show.title}" have been successfully booked.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Booking Details</p>
            <p className="font-semibold">{selectedSeats.length} tickets</p>
            {selectedItems.length > 0 && (
              <p className="text-sm text-gray-600">{selectedItems.length} additional items</p>
            )}
            <p className="text-amber-600 font-bold">UGX {totalAmount.toLocaleString()}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/shows')}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
            >
              Book More Shows
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Show Info Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={show.image}
              alt={show.title}
              className="w-full md:w-48 h-64 object-cover rounded-lg"
            />
            <div className="flex-1">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                {show.genre}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-4">{show.title}</h1>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  {new Date(show.date).toLocaleDateString('en-UG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  {show.time} ({show.duration})
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  {show.venue}
                </div>
              </div>
              <p className="text-gray-600">{show.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Seats</h2>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-200 rounded mr-2"></div>
                  <span>VIP (UGX {show.price.vip.toLocaleString()})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
                  <span>Premium (UGX {show.price.premium.toLocaleString()})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                  <span>Regular (UGX {show.price.regular.toLocaleString()})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                  <span>Unavailable</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-amber-500 rounded mr-2"></div>
                  <span>Selected</span>
                </div>
              </div>

              {/* Stage */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-amber-200 to-orange-200 py-3 px-6 rounded-lg inline-block">
                  <span className="font-semibold text-gray-800">STAGE</span>
                </div>
              </div>

              {/* Seat Map */}
              <div className="space-y-4 max-w-4xl mx-auto">
                {Object.entries(groupedSeats)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([row, rowSeats]) => (
                    <div key={row} className="flex items-center justify-center gap-2">
                      <span className="w-8 text-center font-semibold text-gray-600">{row}</span>
                      <div className="flex gap-1">
                        {rowSeats
                          .sort((a, b) => a.number - b.number)
                          .map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id)}
                              className={`w-8 h-8 rounded text-xs font-semibold transition-all ${getSeatColor(seat)}`}
                              disabled={!seat.isAvailable}
                              title={`${seat.id} - UGX ${seat.price.toLocaleString()} (${seat.type.toUpperCase()})`}
                            >
                              {seat.number}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Additional Items */}
            <BookingItems />
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              {selectedSeats.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">Seat {seat.id}</span>
                          <span className="text-sm text-gray-500 block capitalize">
                            {seat.type} Section
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">
                            UGX {seat.price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => deselectSeat(seat.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-t pt-2">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-500 block">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">
                            UGX {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-6 space-y-2">
                    {seatsTotal > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Seats Subtotal</span>
                        <span>UGX {seatsTotal.toLocaleString()}</span>
                      </div>
                    )}
                    {itemsTotal > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Items Subtotal</span>
                        <span>UGX {itemsTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-xl font-bold text-amber-600">
                        UGX {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {user ? (
                    <button
                      onClick={handleBookingConfirmation}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isProcessing ? (
                        'Processing...'
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 mb-3">Please login to complete booking</p>
                      <button
                        onClick={() => navigate('/')}
                        className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600"
                      >
                        Login to Continue
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Select seats to see your booking summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}