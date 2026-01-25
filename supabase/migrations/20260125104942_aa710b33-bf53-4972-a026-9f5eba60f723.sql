-- Fix 1: Create secure function for supplier role registration
CREATE OR REPLACE FUNCTION public.register_as_supplier()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_current_role app_role;
BEGIN
  -- Get authenticated user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Get current role
  SELECT role INTO v_current_role
  FROM public.user_roles
  WHERE user_id = v_user_id;
  
  -- Only allow upgrade from client to supplier (prevent privilege escalation)
  IF v_current_role != 'client' THEN
    RAISE EXCEPTION 'Can only upgrade from client role';
  END IF;
  
  -- Update role to supplier
  UPDATE public.user_roles
  SET role = 'supplier'
  WHERE user_id = v_user_id
  AND role = 'client';
  
  RETURN FOUND;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.register_as_supplier() TO authenticated;

-- Fix 2: Deny anonymous access to profiles table
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous insert to profiles"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to profiles"
ON public.profiles
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to profiles"
ON public.profiles
FOR DELETE
TO anon
USING (false);

-- Fix 3: Deny anonymous access to suppliers table
CREATE POLICY "Deny anonymous access to suppliers"
ON public.suppliers
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous insert to suppliers"
ON public.suppliers
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to suppliers"
ON public.suppliers
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to suppliers"
ON public.suppliers
FOR DELETE
TO anon
USING (false);

-- Fix 4: Deny anonymous access to orders table
CREATE POLICY "Deny anonymous access to orders"
ON public.orders
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous insert to orders"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to orders"
ON public.orders
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to orders"
ON public.orders
FOR DELETE
TO anon
USING (false);

-- Fix 5: Deny anonymous access to other sensitive tables
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous access to quote_requests"
ON public.quote_requests
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous insert to quote_requests"
ON public.quote_requests
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous access to machines"
ON public.machines
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous access to order_timeline"
ON public.order_timeline
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous access to supplier_recommendations"
ON public.supplier_recommendations
FOR SELECT
TO anon
USING (false);