import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../config/theme';
import { api } from '../services/api';

export const PublishScreen = () => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('vehicle'); // 'vehicle' | 'house'
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Common Fields
  const [description, setDescription] = useState('');
  const [exteriorPhoto, setExteriorPhoto] = useState('');
  const [interiorPhoto, setInteriorPhoto] = useState('');

  // Vehicle Fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  // House Fields
  const [neighborhood, setNeighborhood] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [hasWater, setHasWater] = useState(true);
  const [hasElectricity, setHasElectricity] = useState(true);

  const handlePublish = async () => {
    setLoading(true);
    setErrors({});
    
    let payload = {
      type,
      description,
      exterior_photo: exteriorPhoto,
      interior_photo: interiorPhoto,
      status: true,
    };

    if (type === 'vehicle') {
      payload = { ...payload, brand, model };
    } else {
      payload = { ...payload, neighborhood, bedrooms: parseInt(bedrooms), has_water: hasWater, has_electricity: hasElectricity };
    }

    try {
      await api.post('/items', payload);
      setSuccess(true);
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Échec de la publication de l'annonce." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successTitle}>🎉 Annonce publiée !</Text>
        <Text style={styles.successSub}>Votre annonce est maintenant en ligne.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Publier une annonce</Text>
      <Text style={styles.subtitle}>Remplissez les détails ci-dessous pour mettre votre bien en location.</Text>

      {errors.general && <Text style={styles.errorGeneral}>{errors.general}</Text>}

      {/* Type Selector */}
      <View style={styles.typeSelector}>
        <TouchableOpacity 
          style={[styles.typeButton, type === 'vehicle' && styles.typeButtonActive]}
          onPress={() => setType('vehicle')}
        >
          <Text style={[styles.typeText, type === 'vehicle' && styles.typeTextActive]}>Véhicule</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeButton, type === 'house' && styles.typeButtonActive]}
          onPress={() => setType('house')}
        >
          <Text style={[styles.typeText, type === 'house' && styles.typeTextActive]}>Maison</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Fields */}
      {type === 'vehicle' ? (
        <>
          <Input label="Marque" placeholder="Ex: Toyota" value={brand} onChangeText={setBrand} error={errors.brand && errors.brand[0]} />
          <Input label="Modèle" placeholder="Ex: Corolla 2018" value={model} onChangeText={setModel} error={errors.model && errors.model[0]} />
        </>
      ) : (
        <>
          <Input label="Quartier" placeholder="Ex: Gombe" value={neighborhood} onChangeText={setNeighborhood} error={errors.neighborhood && errors.neighborhood[0]} />
          <Input label="Nombre de chambres" placeholder="Ex: 3" keyboardType="numeric" value={bedrooms} onChangeText={setBedrooms} error={errors.bedrooms && errors.bedrooms[0]} />
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Eau disponible</Text>
            <Switch value={hasWater} onValueChange={setHasWater} trackColor={{ true: theme.colors.success }} />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Électricité disponible</Text>
            <Switch value={hasElectricity} onValueChange={setHasElectricity} trackColor={{ true: theme.colors.success }} />
          </View>
        </>
      )}

      {/* Common Fields */}
      <Input label="Description (Obligatoire)" placeholder="Détails du bien..." multiline numberOfLines={4} style={{ height: 100, textAlignVertical: 'top' }} value={description} onChangeText={setDescription} error={errors.description && errors.description[0]} />
      <Input label="Photo Extérieure (URL)" placeholder="https://..." hint="Lien vers l'image" value={exteriorPhoto} onChangeText={setExteriorPhoto} error={errors.exterior_photo && errors.exterior_photo[0]} />
      <Input label="Photo Intérieure (URL)" placeholder="https://..." hint="Lien vers l'image" value={interiorPhoto} onChangeText={setInteriorPhoto} error={errors.interior_photo && errors.interior_photo[0]} />

      <Button 
        title="Publier l'offre" 
        onPress={handlePublish} 
        loading={loading}
        style={{ marginTop: theme.spacing.m, marginBottom: theme.spacing.xl }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.l,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.l,
    lineHeight: 22,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: 4,
    marginBottom: theme.spacing.xl,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.borderRadius.s,
  },
  typeButtonActive: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.soft,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  typeTextActive: {
    color: theme.colors.primary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switchLabel: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  errorGeneral: {
    color: theme.colors.error,
    marginBottom: theme.spacing.m,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.success,
    marginBottom: 8,
  },
  successSub: {
    fontSize: 16,
    color: theme.colors.textMuted,
  }
});
