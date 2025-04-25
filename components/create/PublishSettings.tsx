import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Switch, TouchableOpacity } from 'react-native';
import { Send, Lock, Globe, Tag } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

// 活动数据类型
interface Activity {
  id: string;
  title: string;
  description: string;
  endDate: string;
}

// 发布设置数据
export interface PublishData {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  activityId?: string;
}

interface PublishSettingsProps {
  onPublish: (data: PublishData) => void;
  initialData?: Partial<PublishData>;
  suggestedTags?: string[];
  availableActivities?: Activity[];
  artifactType?: string;
}

export default function PublishSettings({
  onPublish,
  initialData = {},
  suggestedTags = [],
  availableActivities = [],
  artifactType = '',
}: PublishSettingsProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [isPublic, setIsPublic] = useState(initialData.isPublic !== false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(
    initialData.activityId
  );
  const [newTag, setNewTag] = useState('');
  
  // 生成推荐标签
  const generateRecommendedTags = () => {
    const defaultTags = ['文物创作', 'AI创作', artifactType];
    return [...new Set([...defaultTags, ...suggestedTags])].filter(Boolean);
  };
  
  const recommendedTags = generateRecommendedTags();
  
  // 添加标签
  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };
  
  // 移除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // 处理发布
  const handlePublish = () => {
    if (!title.trim()) {
      alert('请输入作品标题');
      return;
    }
    
    onPublish({
      title,
      description,
      tags,
      isPublic,
      activityId: selectedActivityId,
    });
  };

  return (
    <View style={styles.container}>
      <Text variant="h4" weight="bold" style={styles.title}>
        发布设置
      </Text>
      
      <Text variant="body2" weight="bold" style={styles.label}>
        作品标题
      </Text>
      <TextInput
        style={styles.input}
        placeholder="给你的作品起个名字"
        value={title}
        onChangeText={setTitle}
        maxLength={30}
      />
      
      <Text variant="body2" weight="bold" style={styles.label}>
        作品描述
      </Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="描述一下你的创作灵感或文物故事..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        maxLength={200}
      />
      
      <Text variant="body2" weight="bold" style={styles.label}>
        添加标签
      </Text>
      <View style={styles.tagInput}>
        <TextInput
          style={styles.tagInputField}
          placeholder="添加标签，回车确认"
          value={newTag}
          onChangeText={setNewTag}
          onSubmitEditing={() => addTag(newTag)}
        />
        <TouchableOpacity
          style={styles.tagAddButton}
          onPress={() => addTag(newTag)}
        >
          <Tag size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      {recommendedTags.length > 0 && (
        <View style={styles.suggestedTags}>
          <Text variant="caption" color={colors.gray[600]} style={styles.suggestedTagsTitle}>
            推荐标签：
          </Text>
          <View style={styles.tagChips}>
            {recommendedTags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestedTagChip}
                onPress={() => addTag(tag)}
              >
                <Text variant="caption" color={colors.primary[700]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {tags.length > 0 && (
        <View style={styles.selectedTags}>
          <Text variant="caption" color={colors.gray[600]} style={styles.selectedTagsTitle}>
            已选标签：
          </Text>
          <View style={styles.tagChips}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.selectedTagChip}
                onPress={() => removeTag(tag)}
              >
                <Text variant="caption" color={colors.white}>
                  {tag} ×
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {availableActivities.length > 0 && (
        <View style={styles.activitiesSection}>
          <Text variant="body2" weight="bold" style={styles.label}>
            参与活动
          </Text>
          <View style={styles.activities}>
            {availableActivities.map(activity => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityCard,
                  selectedActivityId === activity.id && styles.selectedActivityCard,
                ]}
                onPress={() => setSelectedActivityId(
                  selectedActivityId === activity.id ? undefined : activity.id
                )}
              >
                <Text variant="body2" weight="bold">
                  {activity.title}
                </Text>
                <Text variant="caption" color={colors.gray[600]}>
                  {activity.description}
                </Text>
                <Text variant="caption" color={colors.gray[500]}>
                  截止日期: {activity.endDate}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.visibilitySection}>
        <View style={styles.visibilityHeader}>
          <Text variant="body2" weight="bold">
            可见性设置
          </Text>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: colors.gray[300], true: colors.primary[300] }}
            thumbColor={isPublic ? colors.primary[500] : colors.gray[500]}
          />
        </View>
        <View style={styles.visibilityDetails}>
          {isPublic ? (
            <View style={styles.visibilityOption}>
              <Globe size={16} color={colors.primary[500]} />
              <Text variant="caption" color={colors.gray[700]} style={styles.visibilityText}>
                公开 - 所有人可以看到你的作品
              </Text>
            </View>
          ) : (
            <View style={styles.visibilityOption}>
              <Lock size={16} color={colors.gray[500]} />
              <Text variant="caption" color={colors.gray[700]} style={styles.visibilityText}>
                私密 - 仅自己可见
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <Button
        variant="primary"
        icon={<Send size={16} color={colors.white} />}
        onPress={handlePublish}
        style={styles.publishButton}
      >
        发布作品
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  title: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tagInput: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  tagInputField: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
    padding: spacing.sm,
  },
  tagAddButton: {
    backgroundColor: colors.primary[500],
    borderTopRightRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestedTags: {
    marginBottom: spacing.sm,
  },
  suggestedTagsTitle: {
    marginBottom: spacing.xs,
  },
  selectedTags: {
    marginBottom: spacing.md,
  },
  selectedTagsTitle: {
    marginBottom: spacing.xs,
  },
  tagChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestedTagChip: {
    backgroundColor: colors.primary[50],
    borderRadius: 16,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  selectedTagChip: {
    backgroundColor: colors.primary[500],
    borderRadius: 16,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  activitiesSection: {
    marginBottom: spacing.md,
  },
  activities: {
    marginBottom: spacing.sm,
  },
  activityCard: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  selectedActivityCard: {
    borderColor: colors.primary[500],
    borderWidth: 2,
    backgroundColor: colors.primary[50],
  },
  visibilitySection: {
    marginBottom: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  visibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  visibilityDetails: {
    padding: spacing.sm,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibilityText: {
    marginLeft: spacing.xs,
  },
  publishButton: {
    marginTop: spacing.sm,
  },
}); 