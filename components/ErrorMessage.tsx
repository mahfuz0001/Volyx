import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleAlert as AlertCircle, X } from 'lucide-react-native';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ 
  message, 
  onDismiss, 
  type = 'error' 
}: ErrorMessageProps) {
  const getColors = () => {
    switch (type) {
      case 'warning':
        return {
          background: '#fef3c7',
          border: '#f59e0b',
          text: '#92400e',
          icon: '#f59e0b',
        };
      case 'info':
        return {
          background: '#dbeafe',
          border: '#3b82f6',
          text: '#1e40af',
          icon: '#3b82f6',
        };
      default:
        return {
          background: '#fee2e2',
          border: '#ef4444',
          text: '#dc2626',
          icon: '#ef4444',
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <AlertCircle size={20} color={colors.icon} />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <X size={16} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});