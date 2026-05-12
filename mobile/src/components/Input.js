import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { theme } from '../config/theme';

export const Input = ({ label, error, hint, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textMuted}
          {...props}
        />
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.m,
    height: 52,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FEF2F2', // Light red bg
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  hintText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
});
