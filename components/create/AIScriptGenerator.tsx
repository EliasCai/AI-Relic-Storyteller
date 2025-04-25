import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Wand2 } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface AIScriptGeneratorProps {
  onScriptGenerated: (script: string) => void;
  artifactName?: string;
  artifactType?: string;
  templateType?: string;
}

export default function AIScriptGenerator({
  onScriptGenerated,
  artifactName = '',
  artifactType = '',
  templateType = '',
}: AIScriptGeneratorProps) {
  const [prompt, setPrompt] = useState(artifactName ? `关于${artifactName}的故事` : '');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 推荐的提示词
  const suggestedPrompts = [
    artifactName ? `${artifactName}的前世今生` : '文物的前世今生',
    artifactName ? `${artifactName}的历史背景` : '文物的历史背景',
    artifactName ? `${artifactName}的文化意义` : '文物的文化意义',
    artifactName ? `${artifactName}的使用场景` : '文物的使用场景',
  ];
  
  // 生成脚本
  const handleGenerateScript = () => {
    if (!prompt.trim()) {
      return;
    }
    
    setIsGenerating(true);
    
    // 模拟AI生成过程
    setTimeout(() => {
      // 根据不同的文物类型和模板类型生成不同风格的脚本
      let scriptTemplate = '';
      
      if (templateType === 'epic') {
        scriptTemplate = `# ${prompt}\n\n## 场景一\n伟大的历史长河中，${artifactName || '这件文物'}以其非凡的姿态屹立于时间的洪流。\n\n## 场景二\n让我们回到那个年代，感受${artifactType || '文物'}诞生的历史瞬间。\n\n## 场景三\n穿越千年的风霜，${artifactName || '它'}依然向世人诉说着那段尘封的记忆。`;
      } else if (templateType === 'chinese') {
        scriptTemplate = `# ${prompt}\n\n## 开场\n青山绿水间，${artifactName || '这件文物'}的故事在岁月中流转。\n\n## 场景一\n宫阙楼台，丝竹悠扬，${artifactType || '文物'}在古人的生活中扮演着怎样的角色？\n\n## 场景二\n斗转星移，时光荏苒，${artifactName || '它'}见证了多少中华文明的璀璨时刻。`;
      } else if (templateType === 'documentary') {
        scriptTemplate = `# ${prompt}\n\n## 引言\n根据考古发现，${artifactName || '这件文物'}距今已有X年历史。\n\n## 主体\n通过科学分析，我们发现${artifactType || '文物'}在当时具有以下几个特点和用途：\n1. 特点一\n2. 用途一\n3. 文化意义\n\n## 结语\n${artifactName || '这件文物'}为我们理解古代文明提供了重要的历史依据。`;
      } else {
        scriptTemplate = `# ${prompt}\n\n## 开场\n这是关于${artifactName || '一件文物'}的故事。\n\n## 主体\n它来自于何方？经历了怎样的岁月？有着怎样的文化底蕴？\n\n## 结语\n让我们一起探索${artifactType || '文物'}背后的历史与文化。`;
      }
      
      setGeneratedScript(scriptTemplate);
      setIsGenerating(false);
      onScriptGenerated(scriptTemplate);
    }, 2000);
  };
  
  return (
    <View style={styles.container}>
      <Text variant="h4" weight="bold" style={styles.title}>
        AI脚本生成
      </Text>
      
      <Text variant="body2" color={colors.gray[700]} style={styles.description}>
        输入创作想法，AI将为您生成脚本大纲
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="输入您的创作想法（如：铜奔马的西域之旅）"
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />
      
      <View style={styles.suggestedPrompts}>
        <Text variant="caption" color={colors.gray[600]} style={styles.suggestedPromptsTitle}>
          推荐提示词：
        </Text>
        <View style={styles.promptChips}>
          {suggestedPrompts.map((suggestedPrompt, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              style={styles.promptChip}
              onPress={() => setPrompt(suggestedPrompt)}
            >
              {suggestedPrompt}
            </Button>
          ))}
        </View>
      </View>
      
      <Button
        variant="primary"
        icon={<Wand2 size={16} color={colors.white} />}
        loading={isGenerating}
        onPress={handleGenerateScript}
        style={styles.generateButton}
      >
        AI生成脚本
      </Button>
      
      {isGenerating && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text variant="body2" color={colors.gray[600]} style={styles.loadingText}>
            正在生成创意脚本...
          </Text>
        </View>
      )}
      
      {generatedScript && !isGenerating && (
        <View style={styles.resultContainer}>
          <Text variant="body2" weight="bold" style={styles.resultTitle}>
            生成结果
          </Text>
          <View style={styles.scriptContainer}>
            <Text variant="body2">{generatedScript}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  suggestedPrompts: {
    marginBottom: spacing.md,
  },
  suggestedPromptsTitle: {
    marginBottom: spacing.xs,
  },
  promptChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  promptChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  generateButton: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  loadingText: {
    marginLeft: spacing.sm,
  },
  resultContainer: {
    marginTop: spacing.md,
  },
  resultTitle: {
    marginBottom: spacing.sm,
  },
  scriptContainer: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
}); 