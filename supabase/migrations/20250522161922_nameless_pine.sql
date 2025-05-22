/*
  # Initial Database Schema

  1. New Tables
    - stations
      - id (uuid, primary key)
      - name (text)
      - manager_name (text)
      - manager_phone (text)
      - address (text)
      - manager_photo (text)
      - active (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - tanks
      - id (uuid, primary key)
      - station_id (uuid, foreign key)
      - name (text)
      - capacity (numeric)
      - current_volume (numeric)
      - product_type (text)
      - last_updated (timestamptz)
      - status (text)
      - selling_price (numeric)
      - expected_revenue (numeric)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - staff
      - id (uuid, primary key)
      - station_id (uuid, foreign key)
      - name (text)
      - email (text)
      - phone (text)
      - role (text)
      - photo (text)
      - date_employed (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - dispensers
      - id (uuid, primary key)
      - station_id (uuid, foreign key)
      - tank_id (uuid, foreign key)
      - name (text)
      - product_type (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - nozzles
      - id (uuid, primary key)
      - dispenser_id (uuid, foreign key)
      - name (text)
      - opening_reading (numeric)
      - closing_reading (numeric)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - activity_logs
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - station_id (uuid, foreign key)
      - type (text)
      - message (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  manager_name text,
  manager_phone text,
  address text,
  manager_photo text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tanks table
CREATE TABLE IF NOT EXISTS tanks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  name text NOT NULL,
  capacity numeric NOT NULL,
  current_volume numeric NOT NULL,
  product_type text NOT NULL CHECK (product_type IN ('PMS', 'AGO')),
  last_updated timestamptz DEFAULT now(),
  status text NOT NULL CHECK (status IN ('Active', 'Inactive', 'Maintenance')),
  selling_price numeric NOT NULL,
  expected_revenue numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  role text NOT NULL,
  photo text,
  date_employed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dispensers table
CREATE TABLE IF NOT EXISTS dispensers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  tank_id uuid REFERENCES tanks(id) ON DELETE CASCADE,
  name text NOT NULL,
  product_type text NOT NULL CHECK (product_type IN ('PMS', 'AGO')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create nozzles table
CREATE TABLE IF NOT EXISTS nozzles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispenser_id uuid REFERENCES dispensers(id) ON DELETE CASCADE,
  name text NOT NULL,
  opening_reading numeric DEFAULT 0,
  closing_reading numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('tank', 'staff', 'dispenser', 'sales', 'price')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispensers ENABLE ROW LEVEL SECURITY;
ALTER TABLE nozzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow authenticated users to read stations"
  ON stations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read tanks"
  ON tanks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read staff"
  ON staff FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read dispensers"
  ON dispensers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read nozzles"
  ON nozzles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tanks_station_id ON tanks(station_id);
CREATE INDEX IF NOT EXISTS idx_staff_station_id ON staff(station_id);
CREATE INDEX IF NOT EXISTS idx_dispensers_station_id ON dispensers(station_id);
CREATE INDEX IF NOT EXISTS idx_nozzles_dispenser_id ON nozzles(dispenser_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_station_id ON activity_logs(station_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);