import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Coins } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
      <LinearGradient
        colors={['#FF7F00', '#FF6B35']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Coins size={16} color="#FFFFFF" />
          <Text style={styles.balanceText}>
            {balance.toLocaleString()}
          </Text>
          {showAddButton && (
            <Plus size={14} color="#FFFFFF" style={styles.plusIcon} />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF7F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 6,
    marginRight: 4,
  },
  plusIcon: {
    marginLeft: 2,
  },
});