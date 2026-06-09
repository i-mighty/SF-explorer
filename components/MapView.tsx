import { useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import NativeMapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Location } from '@/services/types';

interface MapViewProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location | null) => void;
}

// San Francisco center coordinates
const SF_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

/**
 * Native map component for iOS & Android using react-native-maps.
 * Renders markers for each location with selection handling.
 */
export default function MapView({
  locations,
  selectedLocation,
  onSelectLocation,
}: MapViewProps) {
  const mapRef = useRef<NativeMapView>(null);

  const handleMarkerPress = useCallback(
    (location: Location) => {
      onSelectLocation(location);
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude - 0.01, // Offset to show card
          longitude: location.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        },
        400
      );
    },
    [onSelectLocation]
  );

  const handleMapPress = useCallback(() => {
    onSelectLocation(null);
  }, [onSelectLocation]);

  return (
    <View style={styles.container}>
      <NativeMapView
        ref={mapRef}
        style={styles.map}
        initialRegion={SF_REGION}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={false}
        showsCompass
        showsScale
        onPress={handleMapPress}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={location.category}
            onPress={() => handleMarkerPress(location)}
            pinColor={
              selectedLocation?.id === location.id ? '#FF6B6B' : '#0A84FF'
            }
          />
        ))}
      </NativeMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
