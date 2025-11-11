import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { updatePageMeta } from '@/lib/page-meta';

export function usePageMeta() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Extract the base path without query parameters
    const basePath = location.split('?')[0];
    
    // Handle dynamic routes (e.g., /customer/dashboard/:customerId)
    const normalizedPath = basePath.startsWith('/customer/dashboard') 
      ? '/customer/dashboard' 
      : basePath;
    
    updatePageMeta(normalizedPath);
  }, [location]);
}
