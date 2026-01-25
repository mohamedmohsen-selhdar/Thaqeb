import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for generating signed URLs for private storage files.
 * Use this to access files from the cad-drawings bucket securely.
 */
export const useStorageUrls = () => {
  /**
   * Generate a signed URL for a single file path
   * @param filePath - The relative path to the file in the bucket
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns Promise<string> - The signed URL
   */
  const getSignedUrl = async (filePath: string, expiresIn: number = 3600): Promise<string> => {
    // Check if it's already a full URL (legacy data)
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const { data, error } = await supabase.storage
      .from('cad-drawings')
      .createSignedUrl(filePath, expiresIn);
    
    if (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  };

  /**
   * Generate signed URLs for multiple file paths
   * @param filePaths - Array of relative paths to files in the bucket
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns Promise<string[]> - Array of signed URLs
   */
  const getSignedUrls = async (filePaths: string[], expiresIn: number = 3600): Promise<string[]> => {
    if (!filePaths || filePaths.length === 0) {
      return [];
    }

    return Promise.all(
      filePaths.map(path => getSignedUrl(path, expiresIn))
    );
  };

  /**
   * Generate a signed URL for downloading a file
   * @param filePath - The relative path to the file in the bucket
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns Promise<string> - The signed download URL
   */
  const getDownloadUrl = async (filePath: string, expiresIn: number = 3600): Promise<string> => {
    // Check if it's already a full URL (legacy data)
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const { data, error } = await supabase.storage
      .from('cad-drawings')
      .createSignedUrl(filePath, expiresIn, {
        download: true
      });
    
    if (error) {
      console.error('Error generating download URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  };

  return { getSignedUrl, getSignedUrls, getDownloadUrl };
};
