import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Volume2, VolumeX, Maximize, RefreshCw, Wand2, Music, Film, Image, Type } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface AIVideoEditorProps {
  onPublish: (data: { title: string; description: string; tags: string[] }) => void;
}

const TEMPLATES = [
  { id: 'epic', name: '史诗感', icon: <Film size={20} color={colors.white} /> },
  { id: 'chinese', name: '国风轻快', icon: <Image size={20} color={colors.white} /> },
  { id: 'documentary', name: '纪录片风格', icon: <Type size={20} color={colors.white} /> },
];

const FILTERS = [
  { id: 'bronze', name: '青铜光泽' },
  { id: 'fresco', name: '壁画质感' },
  { id: 'ancient', name: '古风滤镜' },
];

export default function AIVideoEditor({ onPublish }: AIVideoEditorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [scriptPrompt, setScriptPrompt] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  
  const handleGenerateScript = () => {
    setIsGenerating(true);
    // 模拟AI生成过程
    setTimeout(() => {
      setGeneratedScript(`这是一段关于${scriptPrompt}的AI生成脚本...`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* 预览区域 */}
      <View style={styles.previewContainer}>
        <LinearGradient
          colors={[colors.gray[800], colors.gray[900]]}
          style={styles.previewPlaceholder}
        >
          <Text color={colors.white}>视频预览区域</Text>
        </LinearGradient>
      </View>

      {/* 时间轴 */}
      <View style={styles.timelineContainer}>
        <Text>时间轴轨道</Text>
      </View>

      {/* 工具面板 */}
      <ScrollView 
        style={styles.toolPanel}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {/* 模板选择 */}
        <View style={styles.toolSection}>
          <Text variant="body2" weight="bold" style={styles.sectionTitle}>模板</Text>
          <View style={styles.templateContainer}>
            {TEMPLATES.map(template => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate === template.id && styles.selectedTemplate
                ]}
                onPress={() => setSelectedTemplate(template.id)}
              >
                <View style={styles.templateIcon}>{template.icon}</View>
                <Text variant="body2" color={colors.white}>{template.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI脚本生成 */}
        <View style={styles.toolSection}>
          <Text variant="body2" weight="bold" style={styles.sectionTitle}>AI脚本生成</Text>
          <TextInput
            style={styles.input}
            placeholder="输入创作想法（如：铜奔马的西域之旅）"
            value={scriptPrompt}
            onChangeText={setScriptPrompt}
          />
          <Button 
            variant="primary" 
            icon={<Wand2 size={16} />}
            loading={isGenerating}
            onPress={handleGenerateScript}
          >
            AI生成
          </Button>
          {generatedScript && (
            <View style={styles.generatedScript}>
              <Text>{generatedScript}</Text>
            </View>
          )}
        </View>

        {/* 特效滤镜 */}
        <View style={styles.toolSection}>
          <Text variant="body2" weight="bold" style={styles.sectionTitle}>特效滤镜</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterCard,
                  selectedFilter === filter.id && styles.selectedFilter
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text>{filter.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 发布设置 */}
        <View style={styles.toolSection}>
          <Text variant="body2" weight="bold" style={styles.sectionTitle}>发布设置</Text>
          <TextInput
            style={styles.input}
            placeholder="作品标题"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="作品描述"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          <Button 
            variant="primary" 
            onPress={() => onPublish({ title, description, tags })}
          >
            发布作品
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  previewContainer: {
    aspectRatio: 16/9,
    backgroundColor: colors.gray[800],
  },
  previewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    height: 60,
    backgroundColor: colors.gray[200],
    padding: spacing.sm,
  },
  toolPanel: {
    flex: 1,
    padding: spacing.md,
  },
  toolSection: {
    width: 280,
    marginRight: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  templateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  templateCard: {
    width: 80,
    height: 100,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[700],
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTemplate: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  templateIcon: {
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  generatedScript: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  filterCard: {
    width: 100,
    height: 60,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  selectedFilter: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
});