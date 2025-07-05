import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.text,
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: Colors.light.tabIconSelected,
        tabBarInactiveBackgroundColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.light.tabIconDefault, 
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
