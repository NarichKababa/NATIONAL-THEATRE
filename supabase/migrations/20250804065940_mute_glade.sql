/*
  # Authentication and User Management System

  1. New Tables
    - `users` - User profiles and metadata
    - `user_activity` - Activity logging for user actions
    - `messages` - Admin messaging system
    - `shows` - Theatre shows
    - `bookings` - User bookings
    - `reviews` - User reviews

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure admin-only operations

  3. Features
    - User profile management
    - Activity tracking
    - Admin messaging
    - Booking system
    - Review system
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar text,
  phone text,
  location text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User activity logging
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Shows table
CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  venue text NOT NULL,
  duration text NOT NULL,
  genre text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  price_vip integer NOT NULL DEFAULT 0,
  price_premium integer NOT NULL DEFAULT 0,
  price_regular integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  show_id uuid REFERENCES shows(id) ON DELETE CASCADE,
  seats text[] NOT NULL DEFAULT '{}',
  total_amount integer NOT NULL DEFAULT 0,
  booking_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  show_id uuid REFERENCES shows(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table for admin communications
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_ids uuid[] NOT NULL DEFAULT '{}',
  subject text NOT NULL,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'personal' CHECK (message_type IN ('news', 'announcement', 'personal')),
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User activity policies
CREATE POLICY "Users can read own activity"
  ON user_activity
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert activity"
  ON user_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read all activity"
  ON user_activity
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Shows policies (public read, admin write)
CREATE POLICY "Anyone can read shows"
  ON shows
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage shows"
  ON shows
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Bookings policies
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create own reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read messages sent to them"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = ANY(recipient_ids) OR sender_id = auth.uid());

CREATE POLICY "Admins can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample shows data
INSERT INTO shows (title, date, time, venue, duration, genre, description, image, price_vip, price_premium, price_regular) VALUES
(
  'The Pearl of Africa',
  '2025-02-15',
  '19:30',
  'Main Theatre',
  '2h 30min',
  'Cultural Drama',
  'A captivating story celebrating Uganda''s rich cultural heritage and the resilience of its people.',
  'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg',
  50000,
  35000,
  20000
),
(
  'Kampala Nights',
  '2025-02-20',
  '20:00',
  'Studio Theatre',
  '1h 45min',
  'Musical Comedy',
  'A hilarious musical comedy about life in Uganda''s bustling capital city.',
  'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
  40000,
  28000,
  15000
),
(
  'Ancestral Spirits',
  '2025-02-25',
  '18:00',
  'Outdoor Stage',
  '2h 15min',
  'Traditional Dance',
  'An enchanting performance showcasing traditional Ugandan dances and spiritual ceremonies.',
  'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg',
  45000,
  30000,
  18000
);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@theatre.ug' THEN 'admin'
      ELSE 'user'
    END
  );
  
  -- Log user registration
  INSERT INTO user_activity (user_id, activity_type, activity_description)
  VALUES (NEW.id, 'registration', 'User account created');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update user last_login
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS trigger AS $$
BEGIN
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
    UPDATE users 
    SET last_login = NEW.last_sign_in_at
    WHERE id = NEW.id;
    
    -- Log login activity
    INSERT INTO user_activity (user_id, activity_type, activity_description)
    VALUES (NEW.id, 'login', 'User logged in');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for login tracking
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION update_user_last_login();

-- Create admin user if it doesn't exist
DO $$
BEGIN
  -- This will be handled by the trigger when the admin signs up
  NULL;
END $$;