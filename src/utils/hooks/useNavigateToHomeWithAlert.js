import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '@/utils/sweetAlert';

export default async function useNavigateToHomeWithAlert() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  if (isSignedIn) return;
  await Toast.fire({
    title: '請先登入',
    icon: 'warning',
    timer: 1200,
  });
  navigate('/');
}
