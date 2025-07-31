import React, { createContext, useContext, useState, useCallback } from 'react';

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'vip' | 'premium' | 'regular';
  price: number;
  isAvailable: boolean;
  isSelected: boolean;
}

interface Show {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  duration: string;
  genre: string;
  description: string;
  image: string;
  price: {
    vip: number;
    premium: number;
    regular: number;
  };
}

interface Booking {
  id: string;
  showId: string;
  userId: string;
  seats: Seat[];
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface BookingContextType {
  shows: Show[];
  seats: Seat[];
  selectedSeats: Seat[];
  bookings: Booking[];
  initializeSeats: (showId: string) => void;
  selectSeat: (seatId: string) => void;
  deselectSeat: (seatId: string) => void;
  confirmBooking: (showId: string, userId: string) => Promise<boolean>;
  getShowById: (id: string) => Show | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const shows: Show[] = [
    {
      id: '1',
      title: 'The Pearl of Africa',
      date: '2025-02-15',
      time: '19:30',
      venue: 'Main Theatre',
      duration: '2h 30min',
      genre: 'Cultural Drama',
      description: 'A captivating story celebrating Uganda\'s rich cultural heritage and the resilience of its people.',
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg',
      price: { vip: 50000, premium: 35000, regular: 20000 }
    },
    {
      id: '2',
      title: 'Kampala Nights',
      date: '2025-02-20',
      time: '20:00',
      venue: 'Studio Theatre',
      duration: '1h 45min',
      genre: 'Musical Comedy',
      description: 'A hilarious musical comedy about life in Uganda\'s bustling capital city.',
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      price: { vip: 40000, premium: 28000, regular: 15000 }
    },
    {
      id: '3',
      title: 'Ancestral Spirits',
      date: '2025-02-25',
      time: '18:00',
      venue: 'Outdoor Stage',
      duration: '2h 15min',
      genre: 'Traditional Dance',
      description: 'An enchanting performance showcasing traditional Ugandan dances and spiritual ceremonies.',
      image: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg',
      price: { vip: 45000, premium: 30000, regular: 18000 }
    }
  ];

  const generateSeats = useCallback((showId: string): Seat[] => {
    const seatTypes = [
      { type: 'vip' as const, rows: ['A', 'B'], seatsPerRow: 10 },
      { type: 'premium' as const, rows: ['C', 'D', 'E'], seatsPerRow: 12 },
      { type: 'regular' as const, rows: ['F', 'G', 'H', 'I', 'J'], seatsPerRow: 14 }
    ];

    const show = shows.find(s => s.id === showId);
    if (!show) return [];

    const allSeats: Seat[] = [];
    
    seatTypes.forEach(({ type, rows, seatsPerRow }) => {
      rows.forEach(row => {
        for (let i = 1; i <= seatsPerRow; i++) {
          allSeats.push({
            id: `${row}${i}`,
            row,
            number: i,
            type,
            price: show.price[type],
            isAvailable: Math.random() > 0.3, // 70% availability simulation
            isSelected: false
          });
        }
      });
    });

    return allSeats;
  }, [shows]);

  const initializeSeats = useCallback((showId: string) => {
    const newSeats = generateSeats(showId);
    setSeats(newSeats);
    setSelectedSeats([]);
  }, [generateSeats]);

  const selectSeat = useCallback((seatId: string) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId && seat.isAvailable
          ? { ...seat, isSelected: true }
          : seat
      )
    );
    
    setSelectedSeats(prevSelected => {
      const seat = seats.find(s => s.id === seatId);
      if (seat && seat.isAvailable && !prevSelected.find(s => s.id === seatId)) {
        return [...prevSelected, { ...seat, isSelected: true }];
      }
      return prevSelected;
    });
  }, [seats]);

  const deselectSeat = useCallback((seatId: string) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId ? { ...seat, isSelected: false } : seat
      )
    );
    
    setSelectedSeats(prevSelected => 
      prevSelected.filter(seat => seat.id !== seatId)
    );
  }, []);

  const confirmBooking = useCallback(async (showId: string, userId: string): Promise<boolean> => {
    if (selectedSeats.length === 0) return false;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      showId,
      userId,
      seats: [...selectedSeats],
      totalAmount,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    setBookings(prev => [...prev, newBooking]);
    
    // Mark seats as unavailable
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        selectedSeats.find(s => s.id === seat.id)
          ? { ...seat, isAvailable: false, isSelected: false }
          : seat
      )
    );
    
    setSelectedSeats([]);
    return true;
  }, [selectedSeats]);

  const getShowById = useCallback((id: string) => {
    return shows.find(show => show.id === id);
  }, [shows]);

  return (
    <BookingContext.Provider value={{
      shows,
      seats,
      selectedSeats,
      bookings,
      initializeSeats,
      selectSeat,
      deselectSeat,
      confirmBooking,
      getShowById
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}