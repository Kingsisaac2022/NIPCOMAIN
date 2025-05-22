/*
  # Initial Schema Setup

  1. Tables
    - stations: Store station information
    - tanks: Store tank information
    - staff: Store staff information
    - dispensers: Store dispenser information
    - nozzles: Store nozzle information
    - sales: Store sales records
    - expenses: Store expense records
    - activity_logs: Store system activity logs

  2. Security
    - Enable RLS on all tables
    - Create read policies for authenticated users
    
  3. Performance
    - Create indexes for foreign keys
    - Add timestamps for auditing
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

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  dispenser_id uuid REFERENCES dispensers(id) ON DELETE SET NULL,
  nozzle_id uuid REFERENCES nozzles(id) ON DELETE SET NULL,
  shift text NOT NULL CHECK (shift IN ('Morning', 'Afternoon')),
  opening_reading numeric NOT NULL,
  closing_reading numeric NOT NULL,
  volume_sold numeric NOT NULL,
  revenue numeric NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id uuid REFERENCES stations(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('Utilities', 'Maintenance', 'Salary', 'Other')),
  amount numeric NOT NULL,
  notes text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
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
DO $$ 
BEGIN
  EXECUTE 'ALTER TABLE stations ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE tanks ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE staff ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE dispensers ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE nozzles ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE sales ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE expenses ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY';
END $$;

-- Create RLS Policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stations' AND policyname = 'Allow authenticated users to read stations'
  ) THEN
    CREATE POLICY "Allow authenticated users to read stations"
      ON stations FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tanks' AND policyname = 'Allow authenticated users to read tanks'
  ) THEN
    CREATE POLICY "Allow authenticated users to read tanks"
      ON tanks FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Allow authenticated users to read staff'
  ) THEN
    CREATE POLICY "Allow authenticated users to read staff"
      ON staff FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'dispensers' AND policyname = 'Allow authenticated users to read dispensers'
  ) THEN
    CREATE POLICY "Allow authenticated users to read dispensers"
      ON dispensers FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'nozzles' AND policyname = 'Allow authenticated users to read nozzles'
  ) THEN
    CREATE POLICY "Allow authenticated users to read nozzles"
      ON nozzles FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sales' AND policyname = 'Allow authenticated users to read sales'
  ) THEN
    CREATE POLICY "Allow authenticated users to read sales"
      ON sales FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'expenses' AND policyname = 'Allow authenticated users to read expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to read expenses"
      ON expenses FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Allow authenticated users to read activity logs'
  ) THEN
    CREATE POLICY "Allow authenticated users to read activity logs"
      ON activity_logs FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tanks_station_id ON tanks(station_id);
CREATE INDEX IF NOT EXISTS idx_staff_station_id ON staff(station_id);
CREATE INDEX IF NOT EXISTS idx_dispensers_station_id ON dispensers(station_id);
CREATE INDEX IF NOT EXISTS idx_nozzles_dispenser_id ON nozzles(dispenser_id);
CREATE INDEX IF NOT EXISTS idx_sales_station_id ON sales(station_id);
CREATE INDEX IF NOT EXISTS idx_sales_staff_id ON sales(staff_id);
CREATE INDEX IF NOT EXISTS idx_expenses_station_id ON expenses(station_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_station_id ON activity_logs(station_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);