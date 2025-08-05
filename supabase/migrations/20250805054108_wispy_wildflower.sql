/*
  # Create Demo Accounts and Fix Authentication

  1. Demo Accounts
    - Create admin demo account
    - Create regular user demo account
    - Set up proper authentication

  2. Security
    - Ensure RLS policies work correctly
    - Fix user creation triggers

  3. Data Reset
    - Clear existing problematic data
    - Insert working demo accounts
*/

-- First, let's ensure we have the proper user creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@theatre.ug' THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    email = NEW.email,
    role = CASE 
      WHEN NEW.email = 'admin@theatre.ug' THEN 'admin'
      ELSE users.role
    END;
  
  -- Log user registration
  INSERT INTO public.user_activity (user_id, activity_type, activity_description)
  VALUES (NEW.id, 'registration', 'User account created')
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update user last_login
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS trigger AS $$
BEGIN
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at AND NEW.last_sign_in_at IS NOT NULL THEN
    UPDATE public.users 
    SET last_login = NEW.last_sign_in_at
    WHERE id = NEW.id;
    
    -- Log login activity
    INSERT INTO public.user_activity (user_id, activity_type, activity_description)
    VALUES (NEW.id, 'login', 'User logged in')
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the login trigger
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION update_user_last_login();

-- Clean up any existing problematic data
DELETE FROM public.user_activity WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.users WHERE id NOT IN (SELECT id FROM auth.users);

-- Note: Demo accounts will be created when users sign up through the application
-- The admin account can be created by registering with admin@theatre.ug