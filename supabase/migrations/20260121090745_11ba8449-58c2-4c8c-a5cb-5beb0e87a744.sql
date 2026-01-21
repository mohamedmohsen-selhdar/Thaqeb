-- Create storage bucket for CAD drawings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cad-drawings', 
  'cad-drawings', 
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/vnd.dxf', 'model/step', 'model/stl', 'model/iges', 'application/acad', 'application/octet-stream']
);

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload CAD drawings"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cad-drawings');

-- Allow users to read their own uploads
CREATE POLICY "Users can read CAD drawings"
ON storage.objects FOR SELECT
USING (bucket_id = 'cad-drawings');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete CAD drawings"
ON storage.objects FOR DELETE
USING (bucket_id = 'cad-drawings');