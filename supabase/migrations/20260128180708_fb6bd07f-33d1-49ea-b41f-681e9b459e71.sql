-- Create storage bucket for token images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('token-images', 'token-images', true);

-- Allow public read access
CREATE POLICY "Public can view token images"
ON storage.objects FOR SELECT
USING (bucket_id = 'token-images');

-- Allow anyone to upload (admin only in practice via UI)
CREATE POLICY "Anyone can upload token images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'token-images');

-- Allow anyone to update their uploads
CREATE POLICY "Anyone can update token images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'token-images');

-- Allow anyone to delete token images
CREATE POLICY "Anyone can delete token images"
ON storage.objects FOR DELETE
USING (bucket_id = 'token-images');