import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Linking } from 'react-native';
import { Button } from '../components/Button';
import { theme } from '../config/theme';

import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export const ItemDetailsScreen = () => {
  const params = useLocalSearchParams();
  const item = params.itemData ? JSON.parse(params.itemData) : {};
  const isVehicle = item.type === 'vehicle';
  const title = isVehicle ? `${item.brand} ${item.model}` : `Maison - ${item.neighborhood}`;
  
  const images = [];
  if (item.exterior_photo) images.push(item.exterior_photo);
  if (item.interior_photo) images.push(item.interior_photo);
  if (images.length === 0) images.push('https://via.placeholder.com/600x400.png?text=Pas+de+photo');

  const handleContact = () => {
    if (item.user && item.user.whatsapp_number) {
      // Nettoyer le numéro pour WhatsApp (enlever les + ou espaces si besoin)
      const phone = item.user.whatsapp_number.replace(/[^0-9]/g, '');
      const message = `Bonjour, je suis intéressé par votre annonce : ${title}.`;
      Linking.openURL(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`)
        .catch(() => alert('Assurez-vous que WhatsApp est installé sur votre appareil.'));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>
        {images.length > 1 && (
          <Text style={styles.imageIndicator}>Glissez pour voir plus ➔</Text>
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <View style={[styles.badge, { backgroundColor: isVehicle ? '#DBEAFE' : '#D1FAE5' }]}>
              <Text style={[styles.badgeText, { color: isVehicle ? '#1D4ED8' : '#047857' }]}>
                {isVehicle ? 'Véhicule' : 'Maison'}
              </Text>
            </View>
          </View>

          <Text style={styles.statusText}>
            Status: {item.status ? (
              <Text style={{ color: theme.colors.success }}>Disponible</Text>
            ) : (
              <Text style={{ color: theme.colors.error }}>Indisponible</Text>
            )}
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description || "Aucune description fournie."}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            {isVehicle ? (
              <View>
                <Text style={styles.detailText}>• Marque : {item.brand}</Text>
                <Text style={styles.detailText}>• Modèle : {item.model}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.detailText}>• Quartier : {item.neighborhood}</Text>
                <Text style={styles.detailText}>• Chambres : {item.bedrooms}</Text>
                <Text style={styles.detailText}>• Eau : {item.has_water ? 'Oui' : 'Non'}</Text>
                <Text style={styles.detailText}>• Électricité : {item.has_electricity ? 'Oui' : 'Non'}</Text>
              </View>
            )}
          </View>
          
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button 
          title="Contacter le fournisseur via WhatsApp" 
          onPress={handleContact}
          disabled={!item.user || !item.user.whatsapp_number}
        />
        {(!item.user || !item.user.whatsapp_number) && (
          <Text style={styles.errorHint}>Numéro WhatsApp indisponible</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  carousel: {
    height: 300,
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicator: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
  content: {
    padding: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.s,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.s,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.s,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
  },
  section: {
    marginBottom: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    ...theme.shadows.soft,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  detailText: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.xl, // for safe area on iOS
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  errorHint: {
    textAlign: 'center',
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
  }
});
