import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  View, 
  Dimensions 
} from 'react-native';
import { Play, Heart, MessageCircle, Share2 } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface ContentCardProps {
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  imageUrl: string;
  likes: number;
  comments: number;
  onPress: () => void;
  onLikePress: () => void;
  onCommentPress: () => void;
  onSharePress: () => void;
}

const { width } = Dimensions.get('window');

export default function ContentCard({ 
  title, 
  author, 
  imageUrl, 
  likes,
  comments,
  onPress,
  onLikePress,
  onCommentPress,
  onSharePress
}: ContentCardProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.cardContainer} 
        activeOpacity={0.9}
        onPress={onPress}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.playButtonContainer}>
            <View style={styles.playButton}>
              <Play size={20} color={colors.white} fill={colors.white} />
            </View>
          </View>
        </View>
        
        <View style={styles.authorRow}>
          <Image source={{ uri: author.avatar }} style={styles.avatar} />
          <Text 
            variant="body2" 
            weight="medium" 
            style={styles.authorName}
          >
            {author.name}
          </Text>
        </View>
        
        <Text 
          variant="body1" 
          weight="medium" 
          numberOfLines={2}
          style={styles.title}
        >
          {title}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
          <Heart size={20} color={colors.gray[700]} />
          <Text variant="caption" color={colors.gray[700]} style={styles.actionText}>
            {likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <MessageCircle size={20} color={colors.gray[700]} />
          <Text variant="caption" color={colors.gray[700]} style={styles.actionText}>
            {comments}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onSharePress}>
          <Share2 size={20} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    marginHorizontal: 16,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardContainer: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.xs,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  authorName: {
    marginLeft: spacing.sm,
  },
  title: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingVertical: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  actionText: {
    marginLeft: spacing.xs,
  },
});