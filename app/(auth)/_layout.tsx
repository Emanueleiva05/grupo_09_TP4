import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // o true si querés que muestre encabezado
      }}
    />
  );
}
