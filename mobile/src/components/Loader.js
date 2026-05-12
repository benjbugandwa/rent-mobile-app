import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { theme } from '../config/theme';

export const Loader = ({ fullScreen = false, text = 'Chargement...' }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
          {text ? <Text style={styles.text}>{text}</Text> : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size="small" color={theme.colors.secondary} />
      {text ? <Text style={styles.inlineText}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    ...theme.shadows.medium,
    alignItems: 'center',
  },
  text: {
    marginTop: theme.spacing.m,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  inline: {
    padding: theme.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inlineText: {
    marginLeft: theme.spacing.s,
    color: theme.colors.textMuted,
    fontSize: 14,
  }
});
