import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Dimensions } from 'react-native';
import { Play, Heart } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius } from '@/constants/theme';

interface FeaturedCardProps {
  title: string;
  author: string;
  imageUrl: string;
  likes: number;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function FeaturedCard({ 
  title, 
  author, 
  imageUrl, 
  likes,
  onPress 
}: FeaturedCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      
      <View style={styles.overlay}>
        <View style={styles.playButton}>
          <Play size={20} color={colors.white} fill={colors.white} />
        </View>
        
        <View style={styles.contentContainer}>
          <Text 
            variant="h4" 
            weight="bold" 
            color={colors.white} 
            numberOfLines={2}
          >
            {title}
          </Text>
          
          <View style={styles.authorContainer}>
            <Text 
              variant="body2" 
              color={colors.white}
              style={{ opacity: 0.9 }}
            >
              {author}
            </Text>
            
            <View style={styles.likeContainer}>
              <Heart size={14} color={colors.white} fill={colors.white} />
              <Text 
                variant="caption" 
                color={colors.white}
                style={{ marginLeft: 4 }}
              >
                {likes}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  contentContainer: {
    justifyContent: 'flex-end',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});