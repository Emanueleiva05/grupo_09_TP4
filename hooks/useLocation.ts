import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from "react";


export type Coordinates = { latitude: number; longitude: number };

export function useLocation() {
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [errorLocation, setErrorLocation] = useState<string | null>(null);

    const pedirPermiso = useCallback(async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorLocation('No se tiene permiso para acceder a la ubicacion');
            setLocation(null);
            return false;
        }
        
        setErrorLocation(null);
        return true;
    }, []);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;
        
        (async () =>{
            const granted = await pedirPermiso();
            if (!granted) return;
            
            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 10,
                },
                (loc) => {
                    setLocation({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    });
                }
            );
        })();
        
        return () => {
            subscription?.remove();
        };
    }, [pedirPermiso]);

    return { location, errorLocation, pedirPermiso };
}