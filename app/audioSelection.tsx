import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Play, Pause, Music, Mic } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, shadows } from '@/constants/theme';

// 定义类型
interface VoiceOption {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
}

interface MusicOption {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
}

// 示例旁白声音数据
const voiceOptions: VoiceOption[] = [
  { id: 'v1', name: '老者', description: '苍老有韵味的男性声音，富有历史感', previewUrl: 'https://example.com/voice1.mp3' },
  { id: 'v2', name: '讲解员', description: '专业清晰的女性声音，像博物馆讲解员', previewUrl: 'https://example.com/voice2.mp3' },
  { id: 'v3', name: '少年', description: '年轻活力的男性声音，充满朝气', previewUrl: 'https://example.com/voice3.mp3' },
  { id: 'v4', name: '古风', description: '古典韵味的女性声音，富有诗意', previewUrl: 'https://example.com/voice4.mp3' },
];

// 示例背景音乐数据
const musicOptions: MusicOption[] = [
  { id: 'm1', name: '古典中国', description: '传统古筝与笛子，营造古典文化氛围', previewUrl: 'https://example.com/music1.mp3' },
  { id: 'm2', name: '宫廷雅乐', description: '古代宫廷音乐风格，庄重典雅', previewUrl: 'https://example.com/music2.mp3' },
  { id: 'm3', name: '山水田园', description: '自然声音与古琴结合，宁静致远', previewUrl: 'https://example.com/music3.mp3' },
  { id: 'm4', name: '现代民乐', description: '中西合璧的现代民族音乐，大气磅礴', previewUrl: 'https://example.com/music4.mp3' },
];

export default function AudioSelectionScreen() {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0].id);
  const [selectedMusic, setSelectedMusic] = useState(musicOptions[0].id);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);
  
  // 处理音频播放
  const handlePlayVoice = (id: string) => {
    // 如果正在播放，先暂停
    if (playingVoice) {
      setPlayingVoice(null);
    }
    
    // 播放新的声音
    if (id !== playingVoice) {
      setPlayingVoice(id);
      // 这里应该有实际的音频播放逻辑
      // 模拟播放结束
      setTimeout(() => {
        setPlayingVoice(null);
      }, 5000);
    }
  };
  
  const handlePlayMusic = (id: string) => {
    if (playingMusic) {
      setPlayingMusic(null);
    }
    
    if (id !== playingMusic) {
      setPlayingMusic(id);
      // 这里应该有实际的音频播放逻辑
      // 模拟播放结束
      setTimeout(() => {
        setPlayingMusic(null);
      }, 5000);
    }
  };
  
  const handleContinue = () => {
    // 显示加载状态
    setIsLoading(true);
    
    // 模拟加载过程
    setTimeout(() => {
      setIsLoading(false);
      // 进入到最终生成页面
      router.push({
        pathname: '/finalGeneration',
        params: {
          artifactId: params.artifactId,
          scriptId: params.scriptId,
          styleId: params.styleId,
          characters: params.characters,
          voiceId: selectedVoice,
          musicId: selectedMusic
        }
      });
    }, 1000);
  };
  
  const renderVoiceItem = ({ item }: { item: VoiceOption }) => (
    <TouchableOpacity
      style={[
        styles.audioOptionItem,
        selectedVoice === item.id && styles.selectedAudioOption
      ]}
      onPress={() => setSelectedVoice(item.id)}
    >
      <View style={styles.audioOptionContent}>
        <View style={styles.audioOptionHeader}>
          <View>
            <Text variant="body1" weight="bold">
              {item.name}
            </Text>
            <Text variant="caption" color={colors.gray[600]} style={styles.audioDescription}>
              {item.description}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => handlePlayVoice(item.id)}
          >
            {playingVoice === item.id ? (
              <Pause size={20} color={colors.white} />
            ) : (
              <Play size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderMusicItem = ({ item }: { item: MusicOption }) => (
    <TouchableOpacity
      style={[
        styles.audioOptionItem,
        selectedMusic === item.id && styles.selectedAudioOption
      ]}
      onPress={() => setSelectedMusic(item.id)}
    >
      <View style={styles.audioOptionContent}>
        <View style={styles.audioOptionHeader}>
          <View>
            <Text variant="body1" weight="bold">
              {item.name}
            </Text>
            <Text variant="caption" color={colors.gray[600]} style={styles.audioDescription}>
              {item.description}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => handlePlayMusic(item.id)}
          >
            {playingMusic === item.id ? (
              <Pause size={20} color={colors.white} />
            ) : (
              <Play size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text variant="body1" style={{ marginTop: spacing.md }}>
          正在准备生成您的文物故事视频...
        </Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Stack.Screen 
        options={{
          title: '音频选择',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color={colors.gray[800]} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mic size={24} color={colors.primary[600]} />
            <Text variant="h4" weight="bold" style={{ marginLeft: spacing.sm }}>
              选择旁白声音
            </Text>
          </View>
          
          <Text variant="body2" color={colors.gray[600]} style={styles.sectionDescription}>
            请选择一种声音风格为您的文物故事配音
          </Text>
          
          <FlatList
            data={voiceOptions}
            renderItem={renderVoiceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.audioOptionsList}
          />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Music size={24} color={colors.primary[600]} />
            <Text variant="h4" weight="bold" style={{ marginLeft: spacing.sm }}>
              选择背景音乐
            </Text>
          </View>
          
          <Text variant="body2" color={colors.gray[600]} style={styles.sectionDescription}>
            为您的文物故事选择合适的背景音乐
          </Text>
          
          <FlatList
            data={musicOptions}
            renderItem={renderMusicItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.audioOptionsList}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="返回"
          variant="outline"
          onPress={() => router.back()}
          containerStyle={styles.backButton}
        />
        
        <Button
          title="下一步：生成视频"
          onPress={handleContinue}
          containerStyle={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    marginBottom: spacing.lg,
  },
  divider: {
    height: 8,
    backgroundColor: colors.gray[100],
  },
  audioOptionsList: {
    paddingVertical: spacing.sm,
  },
  audioOptionItem: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  selectedAudioOption: {
    borderColor: colors.primary[500],
    borderWidth: 2,
    backgroundColor: colors.primary[50],
  },
  audioOptionContent: {
    padding: spacing.md,
  },
  audioOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioDescription: {
    marginTop: spacing.xs,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  backButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  continueButton: {
    flex: 2,
  },
}); 