import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');
const STYLE_CARD_WIDTH = width * 0.8;
const STYLE_CARD_SPACING = 16;

// 示例风格数据
const styleOptions = [
  {
    id: '1',
    name: '奇幻风格',
    description: '神秘而充满魔幻色彩的视觉效果，适合展现文物的神秘面',
    image: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg',
  },
  {
    id: '2',
    name: '历史写实',
    description: '注重历史细节的写实风格，带您穿越到文物诞生的年代',
    image: 'https://images.pexels.com/photos/5022847/pexels-photo-5022847.jpeg',
  },
  {
    id: '3',
    name: '中国水墨',
    description: '传统水墨画风格，体现东方美学与传统文化韵味',
    image: 'https://images.pexels.com/photos/6423416/pexels-photo-6423416.jpeg',
  },
  {
    id: '4',
    name: '现代科技',
    description: '融合现代科技元素的未来感风格，展现传统与现代的碰撞',
    image: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg',
  },
  {
    id: '5',
    name: '卡通动漫',
    description: '活泼可爱的卡通风格，让历史文物更具亲和力和趣味性',
    image: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
  },
];

// 示例角色数据
const characterOptions = [
  {
    id: '1',
    name: '陶工匠人',
    description: '精通制瓷技艺的宫廷御用匠人',
    image: 'https://images.pexels.com/photos/7005593/pexels-photo-7005593.jpeg',
  },
  {
    id: '2',
    name: '宫廷画师',
    description: '负责在瓷器上绘制精美图案的宫廷画师',
    image: 'https://images.pexels.com/photos/6152103/pexels-photo-6152103.jpeg',
  },
  {
    id: '3',
    name: '明朝皇帝',
    description: '使用这件瓷器的明代帝王',
    image: 'https://images.pexels.com/photos/5428824/pexels-photo-5428824.jpeg',
  },
  {
    id: '4',
    name: '现代考古学家',
    description: '研究这件文物历史与工艺的现代专家',
    image: 'https://images.pexels.com/photos/6280651/pexels-photo-6280651.jpeg',
  },
  {
    id: '5',
    name: '瓷器本身',
    description: '以文物自身为第一人称视角讲述故事',
    image: 'https://images.pexels.com/photos/12718980/pexels-photo-12718980.jpeg',
  },
];

export default function StyleAndCharacterScreen() {
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // 默认选择第一个风格
      setSelectedStyle(styleOptions[0].id);
      // 默认选择瓷器本身作为角色
      setSelectedCharacters(['5']);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleStyleSelect = (styleId, index) => {
    setSelectedStyle(styleId);
    setCurrentStyleIndex(index);
  };
  
  const handleCharacterToggle = (characterId) => {
    setSelectedCharacters((prev) => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else {
        return [...prev, characterId];
      }
    });
  };
  
  const handleContinue = () => {
    if (!selectedStyle || selectedCharacters.length === 0) {
      // 显示错误提示（在实际应用中实现）
      return;
    }
    
    // 进入到下一步 - 分镜生成
    router.push({
      pathname: '/storyboard',
      params: { 
        artifactId: params.artifactId,
        scriptId: params.scriptId,
        styleId: selectedStyle,
        characters: selectedCharacters.join(',')
      }
    });
  };
  
  const renderStyleItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.styleCard,
        selectedStyle === item.id && styles.selectedStyleCard
      ]}
      onPress={() => handleStyleSelect(item.id, index)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.styleImage}
      />
      <View style={styles.styleInfo}>
        <Text variant="h4" weight="bold" style={styles.styleName}>
          {item.name}
        </Text>
        <Text variant="body2" color={colors.gray[600]} style={styles.styleDescription}>
          {item.description}
        </Text>
        
        {selectedStyle === item.id && (
          <View style={styles.selectedStyleBadge}>
            <Check size={16} color={colors.white} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text variant="body1" style={{ marginTop: spacing.md }}>
          正在加载风格与角色选项...
        </Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Stack.Screen 
        options={{
          title: '选择风格与角色',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color={colors.gray[800]} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            选择视频风格
          </Text>
          <Text variant="body1" color={colors.gray[600]} style={styles.sectionDescription}>
            视频风格将决定整体的视觉效果和氛围，请选择一种您喜欢的风格
          </Text>
        </View>
        
        <View style={styles.styleSelector}>
          <FlatList
            ref={flatListRef}
            data={styleOptions}
            renderItem={renderStyleItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={STYLE_CARD_WIDTH + STYLE_CARD_SPACING}
            decelerationRate="fast"
            contentContainerStyle={styles.styleList}
            initialScrollIndex={currentStyleIndex}
            getItemLayout={(data, index) => ({
              length: STYLE_CARD_WIDTH + STYLE_CARD_SPACING,
              offset: (STYLE_CARD_WIDTH + STYLE_CARD_SPACING) * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / 
                (STYLE_CARD_WIDTH + STYLE_CARD_SPACING)
              );
              setCurrentStyleIndex(index);
              setSelectedStyle(styleOptions[index].id);
            }}
          />
          
          <View style={styles.indicatorContainer}>
            {styleOptions.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentStyleIndex && styles.indicatorActive
                ]}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            选择故事角色
          </Text>
          <Text variant="body1" color={colors.gray[600]} style={styles.sectionDescription}>
            请选择您希望在故事中出现的角色，可以选择一个或多个
          </Text>
        </View>
        
        <View style={styles.characterGrid}>
          {characterOptions.map((character) => (
            <TouchableOpacity
              key={character.id}
              style={[
                styles.characterCard,
                selectedCharacters.includes(character.id) && styles.selectedCharacterCard
              ]}
              onPress={() => handleCharacterToggle(character.id)}
            >
              <Image 
                source={{ uri: character.image }} 
                style={styles.characterImage}
              />
              
              {selectedCharacters.includes(character.id) && (
                <View style={styles.selectedCharacterBadge}>
                  <Check size={16} color={colors.white} />
                </View>
              )}
              
              <View style={styles.characterInfo}>
                <Text variant="body1" weight="bold" style={styles.characterName}>
                  {character.name}
                </Text>
                <Text variant="caption" color={colors.gray[600]} style={styles.characterDescription}>
                  {character.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
          title="下一步：生成分镜"
          onPress={handleContinue}
          containerStyle={styles.continueButton}
          disabled={!selectedStyle || selectedCharacters.length === 0}
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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    marginBottom: spacing.md,
  },
  styleSelector: {
    marginBottom: spacing.xl,
  },
  styleList: {
    paddingHorizontal: (width - STYLE_CARD_WIDTH) / 2,
    paddingBottom: spacing.md,
  },
  styleCard: {
    width: STYLE_CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: STYLE_CARD_SPACING,
    backgroundColor: colors.white,
    ...shadows.md,
  },
  selectedStyleCard: {
    borderWidth: 3,
    borderColor: colors.primary[500],
  },
  styleImage: {
    width: '100%',
    height: 180,
  },
  styleInfo: {
    padding: spacing.md,
  },
  styleName: {
    marginBottom: spacing.xs,
  },
  styleDescription: {
    height: 60,
  },
  selectedStyleBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[300],
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: colors.primary[500],
    width: 16,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    paddingTop: 0,
  },
  characterCard: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...shadows.sm,
    marginHorizontal: '1%',
  },
  selectedCharacterCard: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  characterImage: {
    width: '100%',
    height: 120,
  },
  characterInfo: {
    padding: spacing.md,
  },
  characterName: {
    marginBottom: spacing.xs,
  },
  characterDescription: {
    height: 32,
  },
  selectedCharacterBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
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