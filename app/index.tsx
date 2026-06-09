import { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Animated,
  useColorScheme,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Colors';
import { fetchLocations } from '@/services/api';
import { Location } from '@/services/types';
import MapView from '@/components/MapView';
import LocationCard from '@/components/LocationCard';

export default function MapScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  // Card slide-up animation
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLocations();
      setLocations(data);
    } catch (err) {
      setError('Failed to load locations. Make sure the API server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = useCallback(
    (location: Location | null) => {
      if (location) {
        setSelectedLocation(location);
        Animated.spring(cardAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }).start();
      } else {
        Animated.timing(cardAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setSelectedLocation(null);
        });
      }
    },
    [cardAnim]
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Discovering places…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorEmoji]}>🗺️</Text>
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Couldn't Load Map
        </Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          {error}
        </Text>
        <Text
          style={[styles.retryButton, { color: colors.tint }]}
          onPress={loadLocations}
        >
          Tap to Retry
        </Text>
      </View>
    );
  }

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header overlay */}
      <View
        style={[
          styles.headerOverlay,
          {
            paddingTop: insets.top + Spacing.sm,
            backgroundColor:
              Platform.OS === 'web'
                ? 'rgba(0,0,0,0.35)'
                : colorScheme === 'dark'
                ? 'rgba(0,0,0,0.5)'
                : 'rgba(255,255,255,0.85)',
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color: Platform.OS === 'web' || colorScheme === 'dark' ? '#FFFFFF' : colors.text,
            },
          ]}
        >
          SF Explorer
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            {
              color:
                Platform.OS === 'web' || colorScheme === 'dark'
                  ? 'rgba(255,255,255,0.7)'
                  : colors.textSecondary,
            },
          ]}
        >
          {locations.length} places to discover
        </Text>
      </View>

      {/* Map */}
      <MapView
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* Selected location card */}
      {selectedLocation && (
        <Animated.View
          style={[
            styles.cardContainer,
            {
              paddingBottom: insets.bottom + Spacing.lg,
              transform: [{ translateY: cardTranslateY }],
              opacity: cardAnim,
            },
          ]}
        >
          <LocationCard
            location={selectedLocation}
            onDismiss={() => handleSelectLocation(null)}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.lg,
    ...Typography.body,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  errorTitle: {
    ...Typography.title,
    marginBottom: Spacing.sm,
  },
  errorText: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    ...Typography.subtitle,
    padding: Spacing.md,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.title,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    zIndex: 20,
  },
});
