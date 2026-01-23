-- Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Authenticated users can upload CAD files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view CAD files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their CAD files" ON storage.objects;

-- Create owner-scoped storage policies for cad-drawings bucket
-- Users can only upload files to their own folder (folder name = user_id)
CREATE POLICY "Users can upload CAD files to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cad-drawings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can only view files in their own folder, or internal_ops/admins can view all
CREATE POLICY "Users can view their own CAD files or internal staff can view all"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cad-drawings' 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR has_role(auth.uid(), 'internal_ops'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Users can only update files in their own folder
CREATE POLICY "Users can update their own CAD files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cad-drawings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can only delete files in their own folder
CREATE POLICY "Users can delete their own CAD files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cad-drawings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);