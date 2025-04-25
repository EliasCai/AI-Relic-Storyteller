import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Slider } from 'react-native';
import { Music, Play, Pause, Volume2, Music2 } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

// 音乐数据类型
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // 秒数
  category: string[];
  uri: string;
}

// 预定义音乐列表
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'ancient1',
    title: '古韵流芳',
    artist: '国乐团',
    duration: 180,
    category: ['传统', '古风', '庄重'],
    uri: 'https://example.com/music/ancient1.mp3',
  },
  {
    id: 'epic1',
    title: '史诗传说',
    artist: '交响乐团',
    duration: 210,
    category: ['史诗', '庄重', '大气'],
    uri: 'https://example.com/music/epic1.mp3',
  },
  {
    id: 'light1',
    title: '轻风拂面',
    artist: '轻音乐团',
    duration: 165,
    category: ['轻快', '舒缓', '清新'],
    uri: 'https://example.com/music/light1.mp3',
  },
  {
    id: 'documentary1',
    title: '探索发现',
    artist: '电影配乐',
    duration: 195,
    category: ['纪录片', '神秘', '探索'],
    uri: 'https://example.com/music/documentary1.mp3',
  },
  {
    id: 'cultural1',
    title: '丝路驼铃',
    artist: '民族乐团',
    duration: 220,
    category: ['传统', '民族', '文化'],
    uri: 'https://example.com/music/cultural1.mp3',
  },
];

interface MusicSelectorProps {
  onSelectMusic: (music: MusicTrack) => void;
  selectedMusicId?: string;
  templateType?: string;
}

export default function MusicSelector({
  onSelectMusic,
  selectedMusicId,
  templateType = '',
}: MusicSelectorProps) {
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);

  // 根据模板类型获取推荐的音乐
  const getRecommendedMusic = () => {
    if (templateType === 'epic') {
      return MUSIC_TRACKS.filter(track => track.category.includes('史诗') || track.category.includes('庄重'));
    } else if (templateType === 'chinese') {
      return MUSIC_TRACKS.filter(track => track.category.includes('传统') || track.category.includes('古风'));
    } else if (templateType === 'documentary') {
      return MUSIC_TRACKS.filter(track => track.category.includes('纪录片') || track.category.includes('探索'));
    } else {
      return MUSIC_TRACKS.slice(0, 2); // 默认推荐前两首
    }
  };
  
  const recommendedMusic = getRecommendedMusic();
  
  // 处理音乐播放
  const handlePlayPause = (musicId: string) => {
    if (playingMusicId === musicId) {
      setPlayingMusicId(null); // 暂停当前播放的
    } else {
      setPlayingMusicId(musicId); // 播放新的
    }
  };
  
  // 格式化时间
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h4" weight="bold">配乐</Text>
        <Button 
          variant="text" 
          icon={<Music2 size={16} color={colors.primary[500]} />}
          onPress={() => {}}
        >
          自定义上传
        </Button>
      </View>
      
      {recommendedMusic.length > 0 && (
        <View style={styles.recommendedSection}>
          <Text variant="body2" weight="bold" style={styles.sectionTitle}>
            推荐配乐
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          >
            {recommendedMusic.map(music => (
              <TouchableOpacity
                key={music.id}
                style={[
                  styles.musicCard,
                  selectedMusicId === music.id && styles.selectedMusicCard,
                ]}
                onPress={() => onSelectMusic(music)}
              >
                <View style={styles.musicIconContainer}>
                  <Music size={24} color={colors.primary[500]} />
                </View>
                <View style={styles.musicDetails}>
                  <Text variant="body2" weight="bold" numberOfLines={1}>
                    {music.title}
                  </Text>
                  <Text variant="caption" color={colors.gray[600]} numberOfLines={1}>
                    {music.artist}
                  </Text>
                  <View style={styles.musicControls}>
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => handlePlayPause(music.id)}
                    >
                      {playingMusicId === music.id ? (
                        <Pause size={16} color={colors.white} />
                      ) : (
                        <Play size={16} color={colors.white} />
                      )}
                    </TouchableOpacity>
                    <Text variant="caption" color={colors.gray[500]}>
                      {formatDuration(music.duration)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      <Text variant="body2" weight="bold" style={styles.sectionTitle}>
        所有配乐
      </Text>
      <ScrollView style={styles.allMusicList}>
        {MUSIC_TRACKS.map(music => (
          <TouchableOpacity
            key={music.id}
            style={[
              styles.musicListItem,
              selectedMusicId === music.id && styles.selectedMusicListItem,
            ]}
            onPress={() => onSelectMusic(music)}
          >
            <TouchableOpacity
              style={styles.playIconContainer}
              onPress={() => handlePlayPause(music.id)}
            >
              {playingMusicId === music.id ? (
                <Pause size={18} color={colors.primary[500]} />
              ) : (
                <Play size={18} color={colors.primary[500]} />
              )}
            </TouchableOpacity>
            
            <View style={styles.musicListDetails}>
              <Text variant="body2" weight="bold" numberOfLines={1}>
                {music.title}
              </Text>
              <Text variant="caption" color={colors.gray[600]} numberOfLines={1}>
                {music.artist} · {formatDuration(music.duration)}
              </Text>
            </View>
            
            <View style={styles.musicTags}>
              {music.category.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text variant="caption" color={colors.primary[700]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {playingMusicId && (
        <View style={styles.volumeControl}>
          <Volume2 size={16} color={colors.gray[600]} />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor={colors.primary[500]}
            maximumTrackTintColor={colors.gray[300]}
            thumbTintColor={colors.primary[500]}
          />
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  recommendedSection: {
    marginBottom: spacing.md,
  },
  recommendedList: {
    paddingBottom: spacing.sm,
  },
  musicCard: {
    width: 150,
    height: 120,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  selectedMusicCard: {
    borderColor: colors.primary[500],
    borderWidth: 2,
  },
  musicIconContainer: {
    height: 50,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicDetails: {
    padding: spacing.sm,
  },
  musicControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  playButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  allMusicList: {
    maxHeight: 200,
  },
  musicListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  selectedMusicListItem: {
    backgroundColor: colors.primary[50],
  },
  playIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  musicListDetails: {
    flex: 1,
  },
  musicTags: {
    flexDirection: 'row',
  },
  tagChip: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: spacing.xs,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  slider: {
    flex: 1,
    marginLeft: spacing.sm,
    height: 40,
  },
}); 