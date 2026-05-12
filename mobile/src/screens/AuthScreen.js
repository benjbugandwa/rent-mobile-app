import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../config/theme';
import { api } from '../services/api';

export const AuthScreen = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('google');
  const [errors, setErrors] = useState({});
  const [googleData, setGoogleData] = useState(null);
  
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [extraInfo, setExtraInfo] = useState({
    province: '',
    city: '',
    whatsapp_number: ''
  });

  useEffect(() => {
    if (step === 'extra_info') {
      fetchProvinces();
    }
  }, [step]);

  const fetchProvinces = async () => {
    try {
      const response = await api.get('/provinces');
      setProvinces(response.data.provinces);
    } catch (err) {
      console.log('Error fetching provinces');
    }
  };

  const handleProvinceChange = async (provinceName) => {
    setExtraInfo({ ...extraInfo, province: provinceName, city: '' });
    setCities([]);
    
    const selectedProvince = provinces.find(p => p.name === provinceName);
    if (selectedProvince) {
      try {
        const response = await api.get(`/provinces/${selectedProvince.id}/cities`);
        setCities(response.data.cities);
      } catch (err) {
        console.log('Error fetching cities');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrors({});
    
    // Simulation of Google Sign In (Replace with real Expo Auth Session later)
    const mockGoogleUser = {
      email: 'testprovider@gmail.com',
      name: 'John Doe',
      google_id: '123456789',
      avatar: 'https://via.placeholder.com/150'
    };
    
    setGoogleData(mockGoogleUser);

    try {
      // Step 1: Check if user exists or if they need to provide extra info
      const response = await api.post('/auth/google', mockGoogleUser);
      
      // User logged in directly
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      router.replace('/'); // Redirect to Home
    } catch (err) {
      if (err.response && err.response.status === 422 && err.response.data.message === 'registration_required') {
        // Step 2: Show extra info form
        setStep('extra_info');
      } else {
        setErrors({ general: "Une erreur s'est produite lors de la connexion Google." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      const response = await api.post('/auth/google', {
        ...googleData,
        ...extraInfo
      });
      
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      router.replace('/'); 
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Échec de l'enregistrement." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Devenir Fournisseur</Text>
        <Text style={styles.subtitle}>
          {step === 'google' 
            ? "Connectez-vous pour publier vos maisons ou véhicules." 
            : "Nous avons besoin de quelques informations supplémentaires pour valider votre profil."}
        </Text>

        {errors.general && <Text style={styles.errorGeneral}>{errors.general}</Text>}

        {step === 'google' ? (
          <View style={styles.googleSection}>
            <Button 
              title="Continuer avec Google" 
              onPress={handleGoogleSignIn} 
              loading={loading}
              type="primary"
            />
            <Text style={styles.hintText}>En tant que simple client, aucune inscription n'est requise.</Text>
          </View>
        ) : (
          <View style={styles.formSection}>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Province</Text>
              <View style={[styles.pickerWrapper, errors.province && styles.inputError]}>
                <Picker
                  selectedValue={extraInfo.province}
                  onValueChange={handleProvinceChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionnez une province" value="" color={theme.colors.textMuted} />
                  {provinces.map(p => (
                    <Picker.Item key={p.id} label={p.name} value={p.name} />
                  ))}
                </Picker>
              </View>
              {errors.province && <Text style={styles.errorText}>{errors.province[0]}</Text>}
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Ville</Text>
              <View style={[styles.pickerWrapper, errors.city && styles.inputError]}>
                <Picker
                  selectedValue={extraInfo.city}
                  onValueChange={(val) => setExtraInfo({...extraInfo, city: val})}
                  style={styles.picker}
                  enabled={cities.length > 0}
                >
                  <Picker.Item label={cities.length > 0 ? "Sélectionnez une ville" : "Choisissez d'abord une province"} value="" color={theme.colors.textMuted} />
                  {cities.map(c => (
                    <Picker.Item key={c.id} label={c.name} value={c.name} />
                  ))}
                </Picker>
              </View>
              {errors.city && <Text style={styles.errorText}>{errors.city[0]}</Text>}
            </View>

            <Input
              label="Numéro WhatsApp (Format International)"
              placeholder="Ex: +243810000000"
              keyboardType="phone-pad"
              hint="Indispensable : Commencez par '+' suivi de l'indicatif pays"
              value={extraInfo.whatsapp_number}
              onChangeText={(txt) => setExtraInfo({...extraInfo, whatsapp_number: txt.replace(/\s/g, '')})}
              error={errors.whatsapp_number && errors.whatsapp_number[0]}
            />

            <Button 
              title="Terminer l'inscription" 
              onPress={handleRegister} 
              loading={loading}
              style={{ marginTop: theme.spacing.m }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    ...theme.shadows.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  googleSection: {
    alignItems: 'stretch',
  },
  hintText: {
    textAlign: 'center',
    marginTop: theme.spacing.m,
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  formSection: {
    //
  },
  pickerContainer: {
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    height: 52,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  errorGeneral: {
    color: theme.colors.error,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
    fontWeight: '500',
  }
});
