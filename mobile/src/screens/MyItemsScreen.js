import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Alert, Image, RefreshControl } from 'react-native';
import { api } from '../services/api';
import { theme } from '../config/theme';
import { Loader } from '../components/Loader';

export const MyItemsScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyItems = async () => {
    try {
      const response = await api.get('/profile/items');
      setItems(response.data.items);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de charger vos annonces.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyItems();
  };

  const toggleStatus = async (item) => {
    const newStatus = !item.status;
    
    // Optimistic UI update
    setItems(items.map(i => i.id === item.id ? { ...i, status: newStatus } : i));

    try {
      await api.put(`/items/${item.id}`, { status: newStatus });
    } catch (err) {
      // Revert if error
      setItems(items.map(i => i.id === item.id ? { ...i, status: !newStatus } : i));
      Alert.alert('Erreur', 'Impossible de modifier la disponibilité.');
    }
  };

  const renderItem = ({ item }) => {
    const isVehicle = item.type === 'vehicle';
    const title = isVehicle ? `${item.brand} ${item.model}` : `Maison - ${item.neighborhood}`;
    const imageUrl = item.exterior_photo || 'https://via.placeholder.com/400x250.png?text=Photo';

    return (
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle}>{isVehicle ? 'Véhicule' : 'Maison'}</Text>

          <View style={styles.actionRow}>
            <Text style={[styles.statusLabel, { color: item.status ? theme.colors.success : theme.colors.error }]}>
              {item.status ? '✅ Disponible' : '❌ Indisponible'}
            </Text>
            <Switch
              value={item.status}
              onValueChange={() => toggleStatus(item)}
              trackColor={{ true: theme.colors.success }}
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loader fullScreen text="Chargement de vos annonces..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.secondary]} />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Vous n'avez publié aucune annonce.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.m,
    flexDirection: 'row',
    ...theme.shadows.soft,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.border,
  },
  content: {
    flex: 1,
    padding: theme.spacing.m,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  centerContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  }
});
