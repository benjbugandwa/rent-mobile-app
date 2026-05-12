import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../config/theme';

export const Button = ({ title, onPress, type = 'primary', loading = false, disabled = false, style }) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    if (type === 'primary') return theme.colors.primary;
    if (type === 'secondary') return theme.colors.secondary;
    if (type === 'outline') return 'transparent';
    return theme.colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textMuted;
    if (type === 'outline') return theme.colors.primary;
    return theme.colors.surface;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        type === 'outline' && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: theme.borderRadius.l,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    flexDirection: 'row',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
