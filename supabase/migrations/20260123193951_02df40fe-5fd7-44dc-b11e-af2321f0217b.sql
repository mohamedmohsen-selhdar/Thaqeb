-- =============================================
-- PHASE 1: ENHANCED DATABASE SCHEMA
-- =============================================

-- Add business_type enum
CREATE TYPE public.business_type AS ENUM ('factory', 'startup', 'trader', 'other');

-- Add payment_preference enum  
CREATE TYPE public.payment_preference AS ENUM ('cash', 'partial', 'credit');

-- Add machine_type enum
CREATE TYPE public.machine_type AS ENUM (
  'cnc_milling', 
  'cnc_lathe', 
  'laser_cutting', 
  'plasma_cutting', 
  'bending', 
  'wire_cutting',
  'die_casting',
  'metal_3d_printing',
  'welding',
  'surface_finishing',
  'other'
);

-- Add supplier_specialty enum
CREATE TYPE public.supplier_specialty AS ENUM (
  'cnc_spare_parts',
  'sheet_metal_fabrication',
  'gear_machining',
  'tube_cutting',
  'wire_cutting',
  'die_casting',
  'metal_3d_printing',
  'welding_assembly',
  'surface_finishing',
  'galvanization'
);

-- =============================================
-- ENHANCE PROFILES TABLE (Client fields)
-- =============================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_type business_type,
ADD COLUMN IF NOT EXISTS location_address TEXT,
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- =============================================
-- ENHANCE SUPPLIERS TABLE
-- =============================================
ALTER TABLE public.suppliers
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_preference payment_preference DEFAULT 'cash',
ADD COLUMN IF NOT EXISTS provides_raw_material BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS operating_hours_start TIME DEFAULT '08:00',
ADD COLUMN IF NOT EXISTS operating_hours_end TIME DEFAULT '17:00',
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS specialties supplier_specialty[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_jobs_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS performance_score DECIMAL(3, 2) DEFAULT 0.00;

-- =============================================
-- CREATE MACHINES TABLE
-- =============================================
CREATE TABLE public.machines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  machine_type machine_type NOT NULL,
  name TEXT NOT NULL,
  capacity_description TEXT,
  table_size TEXT,
  tonnage DECIMAL(10, 2),
  xyz_capacity TEXT,
  accuracy TEXT,
  available_hours_per_day INTEGER DEFAULT 8,
  idle_capacity_percent INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on machines
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- RLS policies for machines
CREATE POLICY "Suppliers can manage their own machines"
ON public.machines
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.suppliers s
    WHERE s.id = machines.supplier_id 
    AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Internal ops and admins can view all machines"
ON public.machines
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'internal_ops'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Internal ops and admins can manage all machines"
ON public.machines
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'internal_ops'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Trigger for machines updated_at
CREATE TRIGGER update_machines_updated_at
BEFORE UPDATE ON public.machines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ENHANCE ORDERS TABLE
-- =============================================
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS suggested_material TEXT,
ADD COLUMN IF NOT EXISTS suggested_process TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS supplier_price DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS supplier_lead_days INTEGER,
ADD COLUMN IF NOT EXISTS supplier_submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_selected_supplier_id UUID,
ADD COLUMN IF NOT EXISTS selection_reason TEXT,
ADD COLUMN IF NOT EXISTS quotation_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS internal_po_number TEXT;

-- =============================================
-- CREATE SUPPLIER RECOMMENDATIONS TABLE
-- =============================================
CREATE TABLE public.supplier_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  capability_score DECIMAL(5, 2) DEFAULT 0,
  specialty_score DECIMAL(5, 2) DEFAULT 0,
  location_score DECIMAL(5, 2) DEFAULT 0,
  performance_score DECIMAL(5, 2) DEFAULT 0,
  payment_score DECIMAL(5, 2) DEFAULT 0,
  total_score DECIMAL(5, 2) DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id, supplier_id)
);

-- Enable RLS on supplier_recommendations
ALTER TABLE public.supplier_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for supplier_recommendations
CREATE POLICY "Internal ops and admins can manage recommendations"
ON public.supplier_recommendations
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'internal_ops'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- =============================================
-- ADD REALTIME FOR KEY TABLES
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.machines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;