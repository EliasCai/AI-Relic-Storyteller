import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg';
  roundedLevel?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
}

export default function Card({
  children,
  style,
  shadowLevel = 'md',
  roundedLevel = 'md',
  backgroundColor = colors.white,
}: CardProps) {
  const cardStyle = [
    styles.card,
    shadowLevel !== 'none' && shadows[shadowLevel],
    { 
      borderRadius: roundedLevel !== 'none' ? borderRadius[roundedLevel] : 0,
      backgroundColor 
    },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
});