import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  useColorScheme,
  Platform,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Colors';
import { fetchLocationById } from '@/services/api';
import { Location } from '@/services/types';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (id) {
      loadLocation(Number(id));
    }
  }, [id]);

  const loadLocation = async (locationId: number) => {
    try {
      setLoading(true);
      const data = await fetchLocationById(locationId);
      setLocation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Location not found
        </Text>
      </View>
    );
  }

  const stars = '★'.repeat(Math.floor(location.rating)) +
    (location.rating % 1 >= 0.5 ? '½' : '') +
    '☆'.repeat(5 - Math.ceil(location.rating));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: location.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Gradient overlay */}
          <View style={styles.heroGradient} />

          {/* Back button */}
          <Pressable
            style={[
              styles.backButton,
              { top: insets.top + Spacing.sm },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          {/* Title on hero */}
          <View style={styles.heroContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {location.category}
              </Text>
            </View>
            <Text style={styles.heroTitle}>{location.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.stars}>{stars}</Text>
              <Text style={styles.ratingText}>
                {location.rating.toFixed(1)} · {location.reviewCount} reviews
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Quick info cards */}
          <View style={styles.infoCardsRow}>
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text style={styles.infoCardIcon}>📍</Text>
              <Text
                style={[styles.infoCardLabel, { color: colors.textTertiary }]}
              >
                Address
              </Text>
              <Text
                style={[styles.infoCardValue, { color: colors.text }]}
                numberOfLines={2}
              >
                {location.address}
              </Text>
            </View>

            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text style={styles.infoCardIcon}>🕐</Text>
              <Text
                style={[styles.infoCardLabel, { color: colors.textTertiary }]}
              >
                Hours
              </Text>
              <Text
                style={[styles.infoCardValue, { color: colors.text }]}
                numberOfLines={2}
              >
                {location.hours}
              </Text>
            </View>
          </View>

          {/* Coordinates */}
          <View
            style={[
              styles.coordCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text style={styles.coordIcon}>🌐</Text>
            <View style={styles.coordTextContainer}>
              <Text
                style={[styles.infoCardLabel, { color: colors.textTertiary }]}
              >
                Coordinates
              </Text>
              <Text style={[styles.coordValue, { color: colors.text }]}>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About
            </Text>
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
            >
              {location.description}
            </Text>
          </View>

          {/* Highlights */}
          {location.highlights && location.highlights.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Highlights
              </Text>
              <View style={styles.highlightsGrid}>
                {location.highlights.map((highlight, index) => (
                  <View
                    key={index}
                    style={[
                      styles.highlightChip,
                      {
                        backgroundColor: colors.categoryBadge,
                        borderColor: colors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.highlightChipText,
                        { color: colors.categoryBadgeText },
                      ]}
                    >
                      {highlight}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.subtitle,
  },

  // Hero
  heroContainer: {
    height: 380,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Simulated gradient via layered transparent black
    // On web, a real gradient could be used
    ...(Platform.OS === 'web'
      ? {
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
        }
      : {
          backgroundColor: 'rgba(0,0,0,0.3)',
        }),
  },
  backButton: {
    position: 'absolute',
    left: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.xxl,
    left: Spacing.xl,
    right: Spacing.xl,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    ...Typography.micro,
  },
  heroTitle: {
    color: '#FFFFFF',
    ...Typography.hero,
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: '#FFD700',
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  ratingText: {
    color: 'rgba(255,255,255,0.85)',
    ...Typography.caption,
  },

  // Content
  content: {
    padding: Spacing.xl,
  },
  infoCardsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  infoCardIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  infoCardLabel: {
    ...Typography.micro,
    marginBottom: Spacing.xs,
  },
  infoCardValue: {
    ...Typography.caption,
    fontWeight: '600',
  },
  coordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xxl,
  },
  coordIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  coordTextContainer: {
    flex: 1,
  },
  coordValue: {
    ...Typography.caption,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    lineHeight: 24,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  highlightChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  highlightChipText: {
    ...Typography.caption,
  },
});
