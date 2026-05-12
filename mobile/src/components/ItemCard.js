import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../config/theme';

export const ItemCard = ({ item, onPress }) => {
  const isVehicle = item.type === 'vehicle';
  const title = isVehicle ? `${item.brand} ${item.model}` : `Maison - ${item.neighborhood}`;
  const imageUrl = item.exterior_photo || 'https://via.placeholder.com/400x250.png?text=Pas+de+photo';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={[styles.badge, { backgroundColor: isVehicle ? '#DBEAFE' : '#D1FAE5' }]}>
            <Text style={[styles.badgeText, { color: isVehicle ? '#1D4ED8' : '#047857' }]}>
              {isVehicle ? 'Véhicule' : 'Maison'}
            </Text>
          </View>
        </View>

        {!item.status && (
          <Text style={styles.unavailableText}>Indisponible actuellement</Text>
        )}

        {/* Hints / secondary info */}
        {isVehicle ? (
          <Text style={styles.hint}>Marque: {item.brand}</Text>
        ) : (
          <Text style={styles.hint}>{item.bedrooms} chambres • {item.has_water ? 'Eau dispo' : 'Pas d\'eau'}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.m,
    ...theme.shadows.soft,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.border,
  },
  content: {
    padding: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.s,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.s,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
  unavailableText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  }
});
