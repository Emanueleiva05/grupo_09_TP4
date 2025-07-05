const Routes = {
  Home: '/(tabs)',
  Configuration: '/(tabs)/configuracion',
  Notifications: '/(tabs)/notificaciones',
  Login: '/(auth)/login',
  Register: '/(auth)/register',
} as const; 

export default Routes;
