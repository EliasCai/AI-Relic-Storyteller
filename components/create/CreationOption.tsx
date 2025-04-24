import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface CreationOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientColors: string[];
  onPress: () => void;
}

export default function CreationOption({
  title,
  description,
  icon,
  gradientColors,
  onPress,
}: CreationOptionProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      
      <View style={styles.iconContainer}>
        {icon}
      </View>
      
      <View style={styles.textContainer}>
        <Text 
          variant="h4" 
          weight="bold" 
          color={colors.white}
        >
          {title}
        </Text>
        <Text 
          variant="body2" 
          color={colors.white}
          style={{ opacity: 0.9, marginTop: spacing.xs }}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  iconContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
});