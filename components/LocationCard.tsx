import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  useColorScheme,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Colors';
import { Location } from '@/services/types';

interface LocationCardProps {
  location: Location;
  onDismiss: () => void;
}

/**
 * A slide-up preview card showing the selected location.
 * Uses glassmorphism styling on web and translucent backgrounds on native.
 * Tapping "View Details" navigates to the full detail page.
 */
export default function LocationCard({ location, onDismiss }: LocationCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const stars = '★'.repeat(Math.floor(location.rating)) +
    (location.rating % 1 >= 0.5 ? '½' : '') +
    '☆'.repeat(5 - Math.ceil(location.rating));

  const handleViewDetails = () => {
    router.push(`/details/${location.id}` as any);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          ...(Platform.OS === 'web'
            ? {
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }
            : {}),
        },
      ]}
    >
      {/* Drag handle */}
      <View style={styles.handleContainer}>
        <View
          style={[
            styles.handle,
            { backgroundColor: colors.textTertiary },
          ]}
        />
      </View>

      <View style={styles.cardContent}>
        {/* Thumbnail */}
        <Image
          source={{ uri: location.image }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.categoryBadge },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: colors.categoryBadgeText },
                ]}
              >
                {location.category}
              </Text>
            </View>
          </View>

          <Text
            style={[styles.name, { color: colors.text }]}
            numberOfLines={1}
          >
            {location.name}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>{stars}</Text>
            <Text
              style={[styles.ratingText, { color: colors.textSecondary }]}
            >
              {location.rating.toFixed(1)} ({location.reviewCount})
            </Text>
          </View>

          <Text
            style={[styles.address, { color: colors.textTertiary }]}
            numberOfLines={1}
          >
            📍 {location.address}
          </Text>
        </View>
      </View>

      {/* Action button */}
      <Pressable
        style={({ pressed }) => [
          styles.detailsButton,
          {
            backgroundColor: colors.tint,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        onPress={handleViewDetails}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
        <Text style={styles.detailsButtonArrow}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 8,
        }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    ...Typography.micro,
    fontSize: 9,
  },
  name: {
    ...Typography.subtitle,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  stars: {
    color: '#FFD700',
    fontSize: 12,
    marginRight: Spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  address: {
    fontSize: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    ...Typography.caption,
    fontWeight: '700',
  },
  detailsButtonArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: Spacing.sm,
  },
});
