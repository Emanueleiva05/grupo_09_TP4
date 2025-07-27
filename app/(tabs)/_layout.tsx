import Routes from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Layout() {
  const { usuario } = useAuth();
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const tabIconSelected = useThemeColor({}, 'tabIconSelected');
  const tabIconDefault = useThemeColor({}, 'tabIconDefault');
  
  useEffect(() => {
    if (!usuario) {
      router.replace(Routes.Login);
    }
  }, [usuario]);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: textColor,
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: tabIconSelected,
        tabBarInactiveBackgroundColor: tabIconDefault,
        tabBarStyle: {
          backgroundColor: tabIconDefault, 
          borderTopWidth: 0, 
          elevation: 0, 
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="notificaciones"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="map" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, size }: { name: any; color: string; size: number }) {
  return <Ionicons name={name} color={color} size={size} />;
}
