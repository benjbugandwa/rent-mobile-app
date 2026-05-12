import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, TouchableOpacity, TextInput, Image } from 'react-native';
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchItems = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/items', { 
        params: { search: searchQuery, type: filterType } 
      });
      setItems(response.data.data || []);
    } catch (err) {
      setError('Impossible de charger les annonces. Veuillez vérifier votre connexion.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filterType]); // Refetch when type changes

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
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require('../../assets/images/rent-mobile-logo-removebg-preview.png')} 
              style={{ width: 45, height: 45, marginRight: 12, resizeMode: 'contain' }} 
            />
            <View>
              <Text style={styles.headerTitle}>Rent Mobile</Text>
              <Text style={styles.headerSubtitle}>Véhicules & Maisons</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                  router.push('/my-items');
                } else {
                  router.push('/auth');
                }
              } catch (e) {
                router.push('/auth');
              }
            }}
          >
            <Text style={styles.profileBtnText}>Mes offres</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher (ex: Toyota, Gombe...)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={fetchItems}
            returnKeyType="search"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.tab, filterType === 'all' && styles.activeTab]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.tabText, filterType === 'all' && styles.activeTabText]}>Tout</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, filterType === 'vehicle' && styles.activeTab]}
            onPress={() => setFilterType('vehicle')}
          >
            <Text style={[styles.tabText, filterType === 'vehicle' && styles.activeTabText]}>Véhicules</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, filterType === 'house' && styles.activeTab]}
            onPress={() => setFilterType('house')}
          >
            <Text style={[styles.tabText, filterType === 'house' && styles.activeTabText]}>Maisons</Text>
          </TouchableOpacity>
        </View>

        {/* Publish Button properly visible */}
        <TouchableOpacity 
          style={styles.publishBtn} 
          onPress={async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (token) {
                router.push('/publish');
              } else {
                router.push('/auth');
              }
            } catch (e) {
              router.push('/auth');
            }
          }}
        >
          <Text style={styles.publishBtnText}>+ Publier une annonce</Text>
        </TouchableOpacity>
      </View>

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
    paddingTop: theme.spacing.xl + 10,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.soft,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  profileBtn: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.s,
  },
  profileBtnText: {
    color: '#1D4ED8',
    fontWeight: '600',
    fontSize: 13,
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
  publishBtn: {
    backgroundColor: '#000000',
    marginTop: theme.spacing.m,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginTop: theme.spacing.m,
  },
  searchInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  filterTabs: {
    flexDirection: 'row',
    marginTop: theme.spacing.m,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.s,
    marginRight: theme.spacing.s,
    backgroundColor: theme.colors.background,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  activeTabText: {
    color: theme.colors.surface,
  }
});
