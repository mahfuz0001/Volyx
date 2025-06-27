import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Coins } from 'lucide-react-native';

interface ConnectsBalanceProps {
  balance: number;
  onPress: () => void;
  showAddButton?: boolean;
}

export default function ConnectsBalance({ 
  balance, 
  onPress, 
  showAddButton = true 
}: ConnectsBalanceProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Coins size={20} color="#f59e0b" />
        <Text style={styles.balanceText}>
          {balance.toLocaleString()}
        </Text>
        {showAddButton && (
          <Plus size={16} color="#1e40af" style={styles.plusIcon} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
    marginLeft: 6,
    marginRight: 4,
  },
  plusIcon: {
    marginLeft: 2,
  },
});