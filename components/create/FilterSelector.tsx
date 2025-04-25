import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Filter, Sparkles } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

// 滤镜数据类型
export interface FilterEffect {
  id: string;
  name: string;
  category: 'filter' | 'effect';
  thumbnailUri?: string;
  description: string;
}

// 预定义的滤镜列表
export const FILTERS: FilterEffect[] = [
  {
    id: 'bronze',
    name: '青铜光泽',
    category: 'filter',
    description: '为视频添加古代青铜器的金属质感',
  },
  {
    id: 'fresco',
    name: '壁画质感',
    category: 'filter',
    description: '模拟古代壁画的色彩和质地',
  },
  {
    id: 'ancient',
    name: '古风滤镜',
    category: 'filter',
    description: '中国传统水墨画风格的视觉效果',
  },
  {
    id: 'sepia',
    name: '怀旧褐色',
    category: 'filter',
    description: '添加复古怀旧的褐色调',
  },
  {
    id: 'dramatic',
    name: '戏剧效果',
    category: 'filter',
    description: '增强对比度，营造戏剧性效果',
  },
];

// 预定义的特效列表
export const EFFECTS: FilterEffect[] = [
  {
    id: 'glitter',
    name: '光芒四射',
    category: 'effect',
    description: '为贵重文物添加闪耀光芒',
  },
  {
    id: 'dust',
    name: '岁月尘埃',
    category: 'effect',
    description: '添加漂浮的尘埃颗粒，展现历史感',
  },
  {
    id: 'transition',
    name: '时光穿梭',
    category: 'effect',
    description: '场景切换时的时空穿梭特效',
  },
  {
    id: 'particles',
    name: '粒子飘散',
    category: 'effect',
    description: '使文物元素粒子化飘散',
  },
];

interface FilterSelectorProps {
  onSelectFilter: (filter: FilterEffect) => void;
  onSelectEffect: (effect: FilterEffect) => void;
  selectedFilterId?: string;
  selectedEffectId?: string;
}

export default function FilterSelector({
  onSelectFilter,
  onSelectEffect,
  selectedFilterId,
  selectedEffectId,
}: FilterSelectorProps) {
  const [activeTab, setActiveTab] = useState<'filter' | 'effect'>('filter');
  
  return (
    <View style={styles.container}>
      {/* 选项卡 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'filter' && styles.activeTab]}
          onPress={() => setActiveTab('filter')}
        >
          <Filter 
            size={16} 
            color={activeTab === 'filter' ? colors.primary[500] : colors.gray[500]} 
          />
          <Text 
            variant="body2" 
            weight={activeTab === 'filter' ? 'bold' : 'regular'}
            color={activeTab === 'filter' ? colors.primary[500] : colors.gray[500]}
            style={styles.tabText}
          >
            滤镜
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'effect' && styles.activeTab]}
          onPress={() => setActiveTab('effect')}
        >
          <Sparkles 
            size={16} 
            color={activeTab === 'effect' ? colors.primary[500] : colors.gray[500]} 
          />
          <Text 
            variant="body2" 
            weight={activeTab === 'effect' ? 'bold' : 'regular'}
            color={activeTab === 'effect' ? colors.primary[500] : colors.gray[500]}
            style={styles.tabText}
          >
            特效
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 滤镜列表 */}
      {activeTab === 'filter' && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.itemsContainer}
          contentContainerStyle={styles.itemsContent}
        >
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterCard,
                selectedFilterId === filter.id && styles.selectedCard,
              ]}
              onPress={() => onSelectFilter(filter)}
            >
              <View style={styles.filterImagePlaceholder}>
                {filter.thumbnailUri ? (
                  <Image 
                    source={{ uri: filter.thumbnailUri }} 
                    style={styles.filterImage} 
                  />
                ) : (
                  <Filter size={24} color={colors.primary[300]} />
                )}
              </View>
              <Text 
                variant="body2" 
                weight="bold" 
                style={styles.filterName}
              >
                {filter.name}
              </Text>
              <Text 
                variant="caption" 
                color={colors.gray[600]} 
                style={styles.filterDescription}
                numberOfLines={2}
              >
                {filter.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      {/* 特效列表 */}
      {activeTab === 'effect' && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.itemsContainer}
          contentContainerStyle={styles.itemsContent}
        >
          {EFFECTS.map(effect => (
            <TouchableOpacity
              key={effect.id}
              style={[
                styles.filterCard,
                selectedEffectId === effect.id && styles.selectedCard,
              ]}
              onPress={() => onSelectEffect(effect)}
            >
              <View style={styles.filterImagePlaceholder}>
                {effect.thumbnailUri ? (
                  <Image 
                    source={{ uri: effect.thumbnailUri }} 
                    style={styles.filterImage} 
                  />
                ) : (
                  <Sparkles size={24} color={colors.secondary[300]} />
                )}
              </View>
              <Text 
                variant="body2" 
                weight="bold" 
                style={styles.filterName}
              >
                {effect.name}
              </Text>
              <Text 
                variant="caption" 
                color={colors.gray[600]} 
                style={styles.filterDescription}
                numberOfLines={2}
              >
                {effect.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[500],
  },
  tabText: {
    marginLeft: spacing.xs,
  },
  itemsContainer: {
    maxHeight: 170,
  },
  itemsContent: {
    padding: spacing.md,
  },
  filterCard: {
    width: 120,
    marginRight: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  selectedCard: {
    borderColor: colors.primary[500],
    borderWidth: 2,
    backgroundColor: colors.primary[50],
  },
  filterImagePlaceholder: {
    width: '100%',
    height: 60,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  filterImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  filterName: {
    marginBottom: spacing.xs,
  },
  filterDescription: {
    fontSize: 10,
  },
}); 