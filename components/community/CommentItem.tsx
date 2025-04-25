import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  TextInput
} from 'react-native';
import { Heart, Reply } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius } from '@/constants/theme';

// 评论接口
export interface CommentData {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: CommentData[];
}

interface CommentItemProps {
  comment: CommentData;
  isReply?: boolean;
  onLike?: (id: string, liked: boolean) => void;
  onReply?: (parentId: string, parentAuthor: string) => void;
  onLongPress?: (id: string) => void;
}

export default function CommentItem({
  comment,
  isReply = false,
  onLike,
  onReply,
  onLongPress
}: CommentItemProps) {
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  
  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分钟前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}小时前`;
    } else if (diffInSeconds < 2592000) {
      return `${Math.floor(diffInSeconds / 86400)}天前`;
    } else {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  };
  
  // 处理点赞
  const handleLike = () => {
    if (onLike) {
      onLike(comment.id, !comment.isLiked);
    }
  };
  
  // 处理回复
  const handleReply = () => {
    if (isReplying) {
      // 提交回复
      if (replyText.trim()) {
        // 提交回复逻辑
        setReplyText('');
      }
      setIsReplying(false);
    } else {
      if (onReply) {
        onReply(comment.id, comment.author.name);
      } else {
        setIsReplying(true);
      }
    }
  };
  
  // 切换回复可见性
  const toggleReplies = () => {
    if (comment.replies && comment.replies.length > 0) {
      setRepliesVisible(!repliesVisible);
    }
  };
  
  // 长按评论
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(comment.id);
    }
  };
  
  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      <TouchableOpacity 
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.9}
      >
        <View style={styles.commentHeader}>
          <Image 
            source={{ uri: comment.author.avatar }} 
            style={styles.avatar} 
          />
          
          <View style={styles.commentInfo}>
            <Text variant="body2" weight="bold">{comment.author.name}</Text>
            <Text variant="caption" color={colors.gray[500]}>{formatTime(comment.createdAt)}</Text>
          </View>
        </View>
        
        <Text style={styles.commentContent}>{comment.content}</Text>
      </TouchableOpacity>
      
      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart 
            size={16} 
            color={comment.isLiked ? colors.red[500] : colors.gray[500]} 
            fill={comment.isLiked ? colors.red[500] : 'transparent'} 
          />
          {comment.likes > 0 && (
            <Text variant="caption" color={colors.gray[500]} style={styles.actionText}>
              {comment.likes}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
          <Reply size={16} color={colors.gray[500]} />
          <Text variant="caption" color={colors.gray[500]} style={styles.actionText}>
            回复
          </Text>
        </TouchableOpacity>
        
        {comment.replies && comment.replies.length > 0 && (
          <TouchableOpacity onPress={toggleReplies}>
            <Text 
              variant="caption" 
              color={colors.primary[500]} 
              style={styles.viewReplies}
            >
              {repliesVisible ? '收起回复' : `查看${comment.replies.length}条回复`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isReplying && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder={`回复 ${comment.author.name}...`}
            placeholderTextColor={colors.gray[400]}
            value={replyText}
            onChangeText={setReplyText}
            multiline
            autoFocus
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              !replyText.trim() && styles.sendButtonDisabled
            ]} 
            onPress={handleReply}
            disabled={!replyText.trim()}
          >
            <Text 
              variant="button" 
              color={!replyText.trim() ? colors.gray[400] : colors.white}
            >
              发送
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* 回复列表 */}
      {repliesVisible && comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id}
              comment={reply}
              isReply={true}
              onLike={onLike}
              onReply={(id, author) => onReply && onReply(id, author)}
              onLongPress={onLongPress}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  replyContainer: {
    marginLeft: spacing.lg,
    paddingVertical: spacing.xs,
    borderBottomWidth: 0,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
  },
  commentInfo: {
    flex: 1,
  },
  commentContent: {
    marginLeft: 36 + spacing.sm,
    marginBottom: spacing.xs,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 36 + spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionText: {
    marginLeft: 4,
  },
  viewReplies: {
    marginLeft: spacing.sm,
  },
  repliesContainer: {
    marginTop: spacing.xs,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: spacing.sm,
    marginLeft: 36 + spacing.sm,
    marginRight: spacing.xs,
  },
  replyInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    color: colors.gray[900],
  },
  sendButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[200],
  },
}); 