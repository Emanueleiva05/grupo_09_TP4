import Routes from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { usuario } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (usuario) {
    router.replace(Routes.Home);
    }
  }, [usuario]);
   
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
