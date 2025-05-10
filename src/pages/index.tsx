import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    
    const isAuthenticated = false; 
    if (!isAuthenticated) {
      
      router.push('/login');
    } else {
     
      router.push('/dashboard');
    }
  }, [router]);

  return null; 
}
