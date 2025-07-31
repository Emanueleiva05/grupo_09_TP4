import { AuthProvider } from '@/context/AuthContext';
import { PatentesProvider } from '@/context/patentesContext';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PatentesProvider>
        <Slot />
      </PatentesProvider>
    </AuthProvider>
  );
}
