import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, Share } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius } from '@/constants/theme';

// 计算卡片宽度（考虑两列瀑布流布局）
const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - spacing.md * 3) / 2; // 两列布局，中间和两侧都有间距

// 作品类型定义
type CreationType = '视频' | '绘画' | '故事' | '3D模型' | '设计' | '音频';

// 作品卡片Props接口
export interface CreationCardProps {
  id: string;
  title: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  type: CreationType;
  relicName?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  onLike?: (id: string, liked: boolean) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
}

export default function CreationCard({
  id,
  title,
  coverImage,
  author,
  type,
  relicName,
  likes,
  comments,
  isLiked = false,
  onLike,
  onComment,
  onShare,
}: CreationCardProps) {
  const router = useRouter();
  
  // 处理卡片点击，导航到作品详情页
  const handleCardPress = () => {
    router.push(`/creation/${id}`);
  };
  
  // 处理点赞事件
  const handleLike = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike(id, !isLiked);
    }
  };
  
  // 处理评论事件
  const handleComment = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (onComment) {
      onComment(id);
    } else {
      router.push(`/creation/${id}?action=comment`);
    }
  };
  
  // 处理分享事件
  const handleShare = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(id);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      {/* 作品封面图 */}
      <Image 
        source={{ uri: coverImage }} 
        style={styles.coverImage} 
        resizeMode="cover"
      />
      
      {/* 作品标签（类型、文物来源） */}
      <View style={styles.tags}>
        <View style={styles.typeTag}>
          <Text variant="caption" color={colors.white}>{type}</Text>
        </View>
        
        {relicName && (
          <View style={styles.relicTag}>
            <Text variant="caption" color={colors.white}>基于 {relicName}</Text>
          </View>
        )}
      </View>
      
      {/* 作品标题 */}
      <View style={styles.contentContainer}>
        <Text 
          variant="body2" 
          weight="bold" 
          numberOfLines={2}
          style={styles.title}
        >
          {title}
        </Text>
        
        {/* 作者信息 */}
        <View style={styles.authorContainer}>
          <Image 
            source={{ uri: author.avatar }} 
            style={styles.authorAvatar} 
          />
          <Text 
            variant="caption" 
            color={colors.gray[600]} 
            numberOfLines={1}
            style={styles.authorName}
          >
            {author.name}
          </Text>
        </View>
        
        {/* 互动按钮区 */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleLike}
          >
            <Heart 
              size={16} 
              color={isLiked ? colors.red[500] : colors.gray[600]} 
              fill={isLiked ? colors.red[500] : 'transparent'} 
            />
            <Text 
              variant="caption" 
              color={colors.gray[600]}
              style={styles.actionText}
            >
              {likes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleComment}
          >
            <MessageCircle size={16} color={colors.gray[600]} />
            <Text 
              variant="caption" 
              color={colors.gray[600]}
              style={styles.actionText}
            >
              {comments}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Share size={16} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coverImage: {
    width: '100%',
    height: cardWidth * 1.2, // 保持一定的宽高比
    backgroundColor: colors.gray[200],
  },
  tags: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
  },
  typeTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  relicTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  contentContainer: {
    padding: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.xs,
  },
  authorName: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionText: {
    marginLeft: 4,
  },
}); 