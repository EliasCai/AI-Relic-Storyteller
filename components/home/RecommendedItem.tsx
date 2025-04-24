import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface RecommendedItemProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  onPress: () => void;
}

export default function RecommendedItem({ 
  title, 
  subtitle, 
  imageUrl, 
  onPress 
}: RecommendedItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text 
          variant="body1" 
          weight="medium" 
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text 
          variant="caption" 
          color={colors.gray[500]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    padding: spacing.sm,
    ...shadows.sm,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
});