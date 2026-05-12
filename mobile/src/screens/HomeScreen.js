import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { api } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { Loader } from '../components/Loader';
import { theme } from '../config/theme';

import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setError(null);
      const response = await api.get('/items');
      setItems(response.data.data || []); // Laravel paginate puts data in .data
    } catch (err) {
      setError('Impossible de charger les annonces. Veuillez vérifier votre connexion.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchItems();
  };

  if (loading) {
    return <Loader fullScreen text="Recherche des meilleures offres..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header Area for Filters (To be expanded later) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Découvrez nos offres</Text>
        <Text style={styles.headerSubtitle}>Véhicules et maisons à louer</Text>
      </View>

      {/* Publish Floating Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={async () => {
          const token = await AsyncStorage.getItem('userToken');
          if (token) {
            router.push('/publish');
          } else {
            router.push('/auth');
          }
        }}
      >
        <Text style={styles.fabText}>+ Publier</Text>
      </TouchableOpacity>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ItemCard 
              item={item} 
              onPress={() => router.push({ pathname: `/item/${item.id}`, params: { itemData: JSON.stringify(item) } })} 
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.secondary]} />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Aucune annonce disponible pour le moment.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.m,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.soft,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  list: {
    padding: theme.spacing.m,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    ...theme.shadows.medium,
    zIndex: 100,
  },
  fabText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '700',
  }
});
