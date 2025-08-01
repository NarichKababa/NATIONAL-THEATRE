import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'vip' | 'premium' | 'regular';
  price: number;
  isAvailable: boolean;
  isSelected: boolean;
}

interface BookingItem {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'merchandise' | 'program';
  description: string;
  image?: string;
  isSelected: boolean;
  quantity: number;
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
  bookingItems: BookingItem[];
  selectedItems: BookingItem[];
  initializeSeats: (showId: string) => void;
  selectSeat: (seatId: string) => void;
  deselectSeat: (seatId: string) => void;
  selectItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  confirmBooking: (showId: string, userId: string) => Promise<boolean>;
  getShowById: (id: string) => Show | undefined;
  loadShows: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [shows, setShows] = useState<Show[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedItems, setSelectedItems] = useState<BookingItem[]>([]);

  const bookingItems: BookingItem[] = [
    {
      id: '1',
      name: 'Theatre Program',
      price: 5000,
      category: 'program',
      description: 'Official show program with cast information',
      isSelected: false,
      quantity: 0
    },
    {
      id: '2',
      name: 'Popcorn',
      price: 8000,
      category: 'food',
      description: 'Fresh popcorn for the show',
      isSelected: false,
      quantity: 0
    },
    {
      id: '3',
      name: 'Theatre T-Shirt',
      price: 25000,
      category: 'merchandise',
      description: 'Official Uganda National Theatre t-shirt',
      isSelected: false,
      quantity: 0
    },
    {
      id: '4',
      name: 'Soft Drink',
      price: 3000,
      category: 'food',
      description: 'Refreshing soft drink',
      isSelected: false,
      quantity: 0
    },
    {
      id: '5',
      name: 'Theatre Mug',
      price: 15000,
      category: 'merchandise',
      description: 'Commemorative theatre mug',
      isSelected: false,
      quantity: 0
    }
  ];

  const loadShows = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedShows = data.map(show => ({
        id: show.id,
        title: show.title,
        date: show.date,
        time: show.time,
        venue: show.venue,
        duration: show.duration,
        genre: show.genre,
        description: show.description,
        image: show.image,
        price: {
          vip: show.price_vip,
          premium: show.price_premium,
          regular: show.price_regular
        }
      }));

      setShows(formattedShows);
    } catch (error) {
      console.error('Failed to load shows:', error);
      // Fallback to demo data
      setShows([
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
      ]);
    }
  }, []);

  React.useEffect(() => {
    loadShows();
  }, [loadShows]);

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

  const selectItem = useCallback((itemId: string, quantity: number) => {
    const item = bookingItems.find(i => i.id === itemId);
    if (!item) return;

    setSelectedItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === itemId);
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = { ...item, quantity, isSelected: quantity > 0 };
        return updated;
      } else if (quantity > 0) {
        // Add new item
        return [...prev, { ...item, quantity, isSelected: true }];
      }
      return prev;
    });
  }, [bookingItems]);

  const removeItem = useCallback((itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

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

    try {
      const seatTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
      const itemsTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalAmount = seatTotal + itemsTotal;

      // Save booking to database
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          show_id: showId,
          seats: selectedSeats.map(s => s.id),
          total_amount: totalAmount,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newBooking: Booking = {
          id: data.id,
          showId: data.show_id,
          userId: data.user_id,
          seats: selectedSeats,
          totalAmount: data.total_amount,
          bookingDate: data.created_at,
          status: data.status
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
        setSelectedItems([]);
        
        // Log booking activity
        await supabase
          .from('user_activity')
          .insert({
            user_id: userId,
            activity_type: 'booking',
            activity_description: `Booked tickets for ${shows.find(s => s.id === showId)?.title}`,
            metadata: { booking_id: data.id, seats: selectedSeats.map(s => s.id), items: selectedItems }
          });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Booking failed:', error);
      return false;
    }
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
      bookingItems,
      selectedItems,
      initializeSeats,
      selectSeat,
      deselectSeat,
      selectItem,
      removeItem,
      confirmBooking,
      getShowById,
      loadShows
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