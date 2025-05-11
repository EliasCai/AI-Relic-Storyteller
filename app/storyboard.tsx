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
  Modal,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Edit, X, RefreshCw, Check } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, shadows } from '@/constants/theme';

const THUMBNAIL_ASPECT_RATIO = 4 / 3; // 宽高比例

// 定义分镜类型
interface Storyboard {
  id: string;
  image: any; // 修改为any类型以支持本地图片
  script: string;
}

// 示例分镜数据
const sampleStoryboards: Storyboard[] = [
  {
    id: '1',
    image: require('@/assets/images/frame07.jpeg'),
    script: '高岭土经过淘洗后，被工匠小心翼翼地带回工坊，准备制作瓷器胚体。',
  },
  {
    id: '2',
    image: require('@/assets/images/frame02.jpeg'),
    script: '工匠在转盘上用熟练的双手塑造着我的形态，每一个弧度都经过精确计算。',
  },
  {
    id: '3',
    image: require('@/assets/images/frame03.jpeg'),
    script: '画师手持细笔，专注地在我的表面上描绘精美的龙纹图案。',
  },
  {
    id: '4',
    image: require('@/assets/images/frame04.jpeg'),
    script: '皇帝将我高高举起，置于头顶上方，对着光线细细端详，仿佛要洞察我每一处细微之美。',
  },
  {
    id: '5',
    image: require('@/assets/images/frame05.jpeg'),
    script: '我正被考古学家小心翼翼地进行精细的挖掘和清理工作，考古学家的动作轻柔而精准。',
  },
  {
    id: '6',
    image: require('@/assets/images/frame06.jpeg'),
    script: '数百年后，我在博物馆被人们欣赏，向世人展示明代官窑的辉煌工艺。',
  },
];

export default function StoryboardScreen() {
  const params = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [selectedStoryboard, setSelectedStoryboard] = useState<Storyboard | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 根据屏幕尺寸计算缩略图大小
  const thumbnailWidth = Math.min(width * 0.25, 120);
  const thumbnailHeight = thumbnailWidth / THUMBNAIL_ASPECT_RATIO;
  
  const thumbnailListRef = useRef(null);
  
  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setStoryboards(sampleStoryboards);
      setSelectedStoryboard(sampleStoryboards[0]);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleThumbnailPress = (storyboard: Storyboard, index: number) => {
    setSelectedStoryboard(storyboard);
    setCurrentIndex(index);
  };
  
  const handleEditPress = () => {
    setEditPrompt('');
    setIsEditModalVisible(true);
  };
  
  const handleEditSubmit = () => {
    if (!editPrompt.trim()) {
      setIsEditModalVisible(false);
      return;
    }
    
    setIsEditModalVisible(false);
    setIsRegenerating(true);
    
    // 模拟重新生成分镜
    setTimeout(() => {
      // 在实际应用中，这里会调用API重新生成分镜
      setIsRegenerating(false);
    }, 2000);
  };
  
  const handleContinue = () => {
    // 进入到下一步 - 音乐与旁白选择
    router.push({
      pathname: '/audioSelection',
      params: { 
        artifactId: params.artifactId,
        scriptId: params.scriptId,
        styleId: params.styleId,
        characters: params.characters
      }
    });
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text variant="body1" style={{ marginTop: spacing.md }}>
          正在根据剧本和风格生成分镜...
        </Text>
      </SafeAreaView>
    );
  }
  
  // 计算主图区域的高度
  const mainImageHeight = Math.min(
    // 确保图片区域不会太高，最多占屏幕高度的45%
    height * 0.45,
    // 同时保持宽高比
    width * 0.75
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Stack.Screen 
        options={{
          title: '分镜预览与编辑',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color={colors.gray[800]} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={[styles.mainImageContainer, { height: mainImageHeight }]}>
        {isRegenerating ? (
          <View style={styles.regeneratingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text variant="body1" style={{ marginTop: spacing.md }}>
              正在重新生成分镜...
            </Text>
          </View>
        ) : (
          <>
            <Image 
              source={selectedStoryboard?.image} 
              style={styles.mainImage}
              resizeMode="contain"
            />
            
            <View style={styles.mainImageOverlay}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleEditPress}
              >
                <Edit size={20} color={colors.white} />
                <Text variant="body2" weight="medium" color={colors.white} style={{ marginLeft: spacing.xs }}>
                  编辑此画面
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollableContent}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.scriptContainer}>
            <Text variant="body1" style={styles.scriptText}>
              {selectedStoryboard?.script}
            </Text>
            <Text variant="caption" color={colors.gray[500]} style={styles.frameCount}>
              分镜 {currentIndex + 1}/{storyboards.length}
            </Text>
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.thumbnailsContainer}>
        <FlatList
          ref={thumbnailListRef}
          data={storyboards}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailsList}
          renderItem={({ item, index }: { item: Storyboard; index: number }) => (
            <TouchableOpacity
              style={[
                styles.thumbnailItem,
                { width: thumbnailWidth, height: thumbnailHeight },
                selectedStoryboard?.id === item.id && styles.selectedThumbnail
              ]}
              onPress={() => handleThumbnailPress(item, index)}
            >
              <Image 
                source={item.image} 
                style={styles.thumbnailImage}
              />
              <Text 
                variant="caption" 
                weight="medium" 
                color={colors.white}
                style={styles.thumbnailNumber}
              >
                {index + 1}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item: Storyboard) => item.id}
          initialScrollIndex={currentIndex}
          getItemLayout={(data, index) => ({
            length: thumbnailWidth + spacing.sm,
            offset: (thumbnailWidth + spacing.sm) * index,
            index,
          })}
        />
      </View>
      
      <View style={styles.footer}>
        <Button
          title="返回"
          variant="outline"
          onPress={() => router.back()}
          containerStyle={styles.backButton}
        />
        
        <Button
          title="下一步：选择音频"
          onPress={handleContinue}
          containerStyle={styles.continueButton}
        />
      </View>
      
      {/* 编辑分镜模态框 */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" weight="bold">编辑分镜</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <X size={24} color={colors.gray[800]} />
              </TouchableOpacity>
            </View>
            
            <Text variant="body1" style={styles.modalDescription}>
              请描述您希望如何修改这个画面，例如："调整构图，将人物放在右侧"、"改变光线，使场景更加明亮"等。
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="输入修改描述..."
                placeholderTextColor={colors.gray[400]}
                value={editPrompt}
                onChangeText={setEditPrompt}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                title="取消"
                variant="outline"
                onPress={() => setIsEditModalVisible(false)}
                containerStyle={styles.modalCancelButton}
              />
              
              <Button
                title="重新生成此画面"
                icon={<RefreshCw size={18} color={colors.white} />}
                onPress={handleEditSubmit}
                containerStyle={styles.modalSubmitButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  mainImageContainer: {
    width: '100%',
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  mainImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  regeneratingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  scriptContainer: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  scriptText: {
    lineHeight: 24,
  },
  frameCount: {
    marginTop: spacing.sm,
  },
  thumbnailsContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  thumbnailsList: {
    paddingVertical: spacing.xs,
  },
  thumbnailItem: {
    marginRight: spacing.sm,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedThumbnail: {
    borderWidth: 3,
    borderColor: colors.primary[500],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailNumber: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalDescription: {
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 100,
    maxHeight: 150,
    color: colors.gray[800],
  },
  modalFooter: {
    flexDirection: 'row',
  },
  modalCancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  modalSubmitButton: {
    flex: 2,
  },
}); 