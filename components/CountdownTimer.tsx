import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

interface CountdownTimerProps {
  endTime: Date;
  onExpire?: () => void;
  style?: any;
  compact?: boolean;
}

export default function CountdownTimer({ 
  endTime, 
  onExpire, 
  style, 
  compact = false 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (hours > 0) {
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }

        // Mark as urgent if less than 10 minutes remaining
        setIsUrgent(difference < 10 * 60 * 1000);
      } else {
        setTimeLeft('ENDED');
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <Clock size={12} color={isUrgent ? '#ef4444' : '#6b7280'} />
        <Text style={[
          styles.compactText,
          { color: isUrgent ? '#ef4444' : '#6b7280' }
        ]}>
          {timeLeft}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.timerBox,
        { backgroundColor: isUrgent ? '#fef2f2' : '#f0f9ff' }
      ]}>
        <Clock 
          size={16} 
          color={isUrgent ? '#ef4444' : '#1e40af'} 
          style={styles.icon}
        />
        <Text style={[
          styles.timerText,
          { color: isUrgent ? '#ef4444' : '#1e40af' }
        ]}>
          {timeLeft === 'ENDED' ? 'ENDED' : `${timeLeft}`}
        </Text>
      </View>
      {isUrgent && timeLeft !== 'ENDED' && (
        <Text style={styles.urgentText}>Ending Soon!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  icon: {
    marginRight: 6,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    marginTop: 2,
  },
});