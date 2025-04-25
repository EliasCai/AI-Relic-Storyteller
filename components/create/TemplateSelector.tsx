import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Film, Music, Type, Wand2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

// 模板数据类型
export interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUri?: string;
  category: 'vlog' | 'drama' | 'story' | 'design';
  icon: React.ReactNode;
  gradientColors: string[];
  recommendedFor?: string[]; // 推荐的文物类型
}

// 视频模板数据
export const VIDEO_TEMPLATES: Template[] = [
  {
    id: 'epic',
    name: '史诗感',
    description: '宏大叙事风格，适合重要历史文物',
    category: 'vlog',
    icon: <Film size={20} color={colors.white} />,
    gradientColors: [colors.primary[700], colors.primary[900]],
    recommendedFor: ['青铜器', '玉器', '陶器'],
  },
  {
    id: 'chinese',
    name: '国风轻快',
    description: '富有中国特色的轻快节奏',
    category: 'vlog',
    icon: <Music size={20} color={colors.white} />,
    gradientColors: [colors.secondary[700], colors.secondary[900]],
    recommendedFor: ['瓷器', '丝绸', '绘画'],
  },
  {
    id: 'documentary',
    name: '纪录片风格',
    description: '严谨的知识性讲解风格',
    category: 'vlog',
    icon: <Type size={20} color={colors.white} />,
    gradientColors: [colors.accent[700], colors.accent[900]],
    recommendedFor: ['古籍', '碑刻', '文书'],
  },
  {
    id: 'mysterious',
    name: '神秘探秘',
    description: '探索未知的考古风格',
    category: 'vlog',
    icon: <Wand2 size={20} color={colors.white} />,
    gradientColors: [colors.teal[700], colors.teal[900]],
    recommendedFor: ['墓葬文物', '宗教文物'],
  },
];

interface TemplateSelectorProps {
  category: string;
  artifactType?: string;
  onSelectTemplate: (template: Template) => void;
  selectedTemplateId?: string;
}

export default function TemplateSelector({
  category,
  artifactType,
  onSelectTemplate,
  selectedTemplateId,
}: TemplateSelectorProps) {
  
  // 根据分类和文物类型筛选模板
  const filteredTemplates = VIDEO_TEMPLATES.filter(
    (template) => template.category === category
  );
  
  // 根据文物类型获取推荐模板
  const recommendedTemplates = artifactType
    ? filteredTemplates.filter(
        (template) => template.recommendedFor?.includes(artifactType)
      )
    : [];

  return (
    <View style={styles.container}>
      {recommendedTemplates.length > 0 && (
        <View>
          <Text variant="h4" weight="bold" style={styles.sectionTitle}>
            推荐模板
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.recommendedContainer}
          >
            {recommendedTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplateId === template.id && styles.selectedTemplate,
                ]}
                onPress={() => onSelectTemplate(template)}
              >
                <LinearGradient
                  colors={template.gradientColors}
                  style={styles.templateGradient}
                />
                <View style={styles.templateIconContainer}>
                  {template.icon}
                </View>
                <View style={styles.templateContent}>
                  <Text
                    variant="body2"
                    weight="bold"
                    color={colors.white}
                  >
                    {template.name}
                  </Text>
                  <Text
                    variant="caption"
                    color={colors.white}
                    style={styles.templateDescription}
                  >
                    {template.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <Text variant="h4" weight="bold" style={styles.sectionTitle}>
        所有模板
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.templatesContainer}
      >
        {filteredTemplates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              selectedTemplateId === template.id && styles.selectedTemplate,
            ]}
            onPress={() => onSelectTemplate(template)}
          >
            <LinearGradient
              colors={template.gradientColors}
              style={styles.templateGradient}
            />
            <View style={styles.templateIconContainer}>
              {template.icon}
            </View>
            <View style={styles.templateContent}>
              <Text
                variant="body2"
                weight="bold"
                color={colors.white}
              >
                {template.name}
              </Text>
              <Text
                variant="caption"
                color={colors.white}
                style={styles.templateDescription}
              >
                {template.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  recommendedContainer: {
    marginBottom: spacing.md,
  },
  templatesContainer: {
    marginBottom: spacing.md,
  },
  templateCard: {
    width: 160,
    height: 120,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  selectedTemplate: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  templateGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  templateIconContainer: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
  },
  templateDescription: {
    marginTop: spacing.xs,
    opacity: 0.8,
  },
}); 