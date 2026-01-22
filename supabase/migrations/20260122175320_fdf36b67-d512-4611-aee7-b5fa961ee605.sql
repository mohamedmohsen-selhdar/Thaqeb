
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('client', 'supplier', 'internal_ops', 'admin');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM (
  'draft',
  'pending_review',
  'quoted',
  'accepted',
  'in_production',
  'qa_review',
  'completed',
  'cancelled'
);

-- Create enum for manufacturing process
CREATE TYPE public.manufacturing_process AS ENUM (
  'cnc_machining',
  'sheet_metal',
  '3d_printing',
  'injection_molding',
  'casting',
  'laser_cutting',
  'welding',
  'other'
);

-- Create enum for priority levels
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  capabilities manufacturing_process[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  quality_score DECIMAL(3,2) DEFAULT 0.00,
  on_time_rate DECIMAL(3,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  capacity_cnc INTEGER DEFAULT 0,
  capacity_sheet_metal INTEGER DEFAULT 0,
  capacity_3d_printing INTEGER DEFAULT 0,
  capacity_other INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_requests table
CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  process manufacturing_process,
  material TEXT,
  quantity INTEGER DEFAULT 1,
  dimensions TEXT,
  tolerances TEXT,
  surface_finish TEXT,
  complexity TEXT,
  estimated_time TEXT,
  notes TEXT,
  file_urls TEXT[] DEFAULT '{}',
  ai_analysis JSONB,
  status order_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  process manufacturing_process,
  material TEXT,
  quantity INTEGER DEFAULT 1,
  status order_status DEFAULT 'pending_review',
  priority priority_level DEFAULT 'medium',
  quoted_price DECIMAL(12,2),
  final_price DECIMAL(12,2),
  deadline TIMESTAMP WITH TIME ZONE,
  production_start TIMESTAMP WITH TIME ZONE,
  production_end TIMESTAMP WITH TIME ZONE,
  qa_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_timeline table for tracking status changes
CREATE TABLE public.order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Default role is 'client'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Internal ops and admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'internal_ops') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for user_roles (read-only for users, admins can manage)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for suppliers
CREATE POLICY "Suppliers can view and update their own record"
  ON public.suppliers FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Internal ops and admins can view all suppliers"
  ON public.suppliers FOR SELECT
  USING (
    public.has_role(auth.uid(), 'internal_ops') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Internal ops and admins can manage suppliers"
  ON public.suppliers FOR ALL
  USING (
    public.has_role(auth.uid(), 'internal_ops') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for quote_requests
CREATE POLICY "Clients can manage their own quote requests"
  ON public.quote_requests FOR ALL
  USING (auth.uid() = client_id);

CREATE POLICY "Internal ops and admins can view all quote requests"
  ON public.quote_requests FOR SELECT
  USING (
    public.has_role(auth.uid(), 'internal_ops') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Internal ops and admins can manage quote requests"
  ON public.quote_requests FOR ALL
  USING (
    public.has_role(auth.uid(), 'internal_ops') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for orders
CREATE POLICY "Clients can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Suppliers can view assigned orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.suppliers s 
      WHERE s.id = orders.supplier_id 
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can update assigned orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.suppliers s 
      WHERE s.id = orders.supplier_id 
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Internal ops and admins can manage all orders"
  ON public.orders FOR ALL
  USING (
    public.has_role(auth.uid(), 'internal_ops') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for order_timeline
CREATE POLICY "Users can view timeline for their orders"
  ON public.order_timeline FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = order_timeline.order_id 
      AND (o.client_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM public.suppliers s WHERE s.id = o.supplier_id AND s.user_id = auth.uid()))
    )
  );

CREATE POLICY "Internal ops and admins can manage timeline"
  ON public.order_timeline FOR ALL
  USING (
    public.has_role(auth.uid(), 'internal_ops') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_quote_requests_client_id ON public.quote_requests(client_id);
CREATE INDEX idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX idx_orders_client_id ON public.orders(client_id);
CREATE INDEX idx_orders_supplier_id ON public.orders(supplier_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_timeline_order_id ON public.order_timeline(order_id);
