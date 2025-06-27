import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
        <LinearGradient
          colors={isUrgent ? ['#FF3B30', '#FF6B35'] : ['#1A2B42', '#2D4A6B']}
          style={styles.compactGradient}
        >
          <Clock size={10} color="#FFFFFF" />
          <Text style={styles.compactText}>
            {timeLeft}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={isUrgent ? ['#FF3B30', '#FF6B35'] : ['#1A2B42', '#2D4A6B']}
        style={styles.timerBox}
      >
        <Clock 
          size={14} 
          color="#FFFFFF"
          style={styles.icon}
        />
        <Text style={styles.timerText}>
          {timeLeft === 'ENDED' ? 'ENDED' : timeLeft}
        </Text>
      </LinearGradient>
      {isUrgent && timeLeft !== 'ENDED' && (
        <View style={styles.urgentIndicator}>
          <AlertTriangle size={12} color="#FF3B30" />
          <Text style={styles.urgentText}>Ending Soon!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  compactContainer: {
    alignSelf: 'flex-start',
  },
  compactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compactText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 6,
  },
  timerText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  urgentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FF3B30',
    marginLeft: 4,
  },
});