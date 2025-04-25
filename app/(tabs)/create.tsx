import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform
} from 'react-native';
import { Film, ImagePlus, Video, Wand as Wand2, ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import CreationOption from '@/components/create/CreationOption';
import MaterialSelector from '@/components/create/MaterialSelector';
import TemplateSelector, { Template, VIDEO_TEMPLATES } from '@/components/create/TemplateSelector';
import AIVideoEditor from '@/components/create/AIVideoEditor';
import AIScriptGenerator from '@/components/create/AIScriptGenerator';
import FilterSelector, { FILTERS, EFFECTS } from '@/components/create/FilterSelector';
import MusicSelector, { MUSIC_TRACKS } from '@/components/create/MusicSelector';
import PublishSettings from '@/components/create/PublishSettings';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing } from '@/constants/theme';

// 创作流程步骤
type CreationStep = 
  | 'select-material' 
  | 'select-template' 
  | 'edit' 
  | 'publish';

// 保存一些示例收藏文物
const SAMPLE_COLLECTION_ITEMS = [
  {
    id: '1',
    title: '青铜器',
    thumbnailUri: 'https://placekitten.com/200/200',
    type: 'image'
  },
  {
    id: '2',
    title: '瓷器花瓶',
    thumbnailUri: 'https://placekitten.com/201/201',
    type: 'image'
  },
  {
    id: '3',
    title: '古代书法',
    thumbnailUri: 'https://placekitten.com/202/202',
    type: 'image'
  }
];

// 示例活动
const SAMPLE_ACTIVITIES = [
  {
    id: '1',
    title: '文物创意大赛',
    description: '用AI技术展现文物的前世今生',
    endDate: '2023-12-31'
  },
  {
    id: '2',
    title: '博物馆日特别活动',
    description: '创作你心中的博物馆故事',
    endDate: '2023-12-15'
  }
];

export default function CreateScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // 创作类型（从路由参数或默认选择）
  const [templateType, setTemplateType] = useState(params.templateType as string || '');
  
  // 当前步骤
  const [currentStep, setCurrentStep] = useState<CreationStep>('select-material');
  
  // 选择的素材
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  
  // 选择的模板
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // 生成的脚本
  const [generatedScript, setGeneratedScript] = useState('');
  
  // 选择的滤镜和特效
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedEffect, setSelectedEffect] = useState(null);
  
  // 选择的音乐
  const [selectedMusic, setSelectedMusic] = useState(null);
  
  // 处理发布
  const handlePublish = (publishData) => {
    console.log('发布作品:', {
      template: selectedTemplate,
      material: selectedMaterial,
      script: generatedScript,
      filter: selectedFilter,
      effect: selectedEffect,
      music: selectedMusic,
      publishData
    });
    
    // 模拟发布过程
    Alert.alert(
      '发布成功',
      '你的作品已成功发布',
      [
        { text: '查看作品', onPress: () => console.log('查看作品') },
        { text: '返回首页', onPress: () => router.push('/') }
      ]
    );
  };
  
  // 处理模板选择
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentStep('edit');
  };
  
  // 处理素材选择
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setCurrentStep('select-template');
  };
  
  // 处理后退操作
  const handleBack = () => {
    if (currentStep === 'select-template') {
      setCurrentStep('select-material');
    } else if (currentStep === 'edit') {
      setCurrentStep('select-template');
    } else if (currentStep === 'publish') {
      setCurrentStep('edit');
    } else {
      router.back();
    }
  };
  
  // 前往发布步骤
  const goToPublish = () => {
    setCurrentStep('publish');
  };
  
  // 如果还没有选择创作类型，显示创作类型选择界面
  if (!templateType) {
    return (
      <SafeAreaView style={styles.container}>
        <>
          <View style={styles.header}>
            <Text variant="h3" weight="bold">
              创作
            </Text>
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text variant="body1" style={styles.description}>
              选择创作类型，使用AI辅助快速生成精彩内容
            </Text>
            <CreationOption
              title="文物Vlog"
              description="将静态文物转变为生动视频，讲述其背后的故事"
              icon={<Film size={24} color={colors.white} />}
              gradientColors={[colors.primary[400], colors.primary[600]]}
              onPress={() => setTemplateType('vlog')}
            />
            <CreationOption
              title="历史短剧"
              description="将文物置于历史场景中，重现其使用场景"
              icon={<Video size={24} color={colors.white} />}
              gradientColors={[colors.secondary[400], colors.secondary[600]]}
              onPress={() => setTemplateType('drama')}
            />
            <CreationOption
              title="文创设计"
              description="基于文物元素创作现代设计作品"
              icon={<Wand2 size={24} color={colors.white} />}
              gradientColors={[colors.accent[400], colors.accent[600]]}
              onPress={() => setTemplateType('design')}
            />
            <CreationOption
              title="图文故事"
              description="用精美图文讲述文物背后的文化与历史"
              icon={<ImagePlus size={24} color={colors.white} />}
              gradientColors={[colors.teal[400], colors.teal[600]]}
              onPress={() => setTemplateType('story')}
            />
            <View style={styles.recentHeader}>
              <Text variant="h4" weight="bold">
                我的草稿
              </Text>
              <TouchableOpacity>
                <Text variant="body2" color={colors.primary[500]}>
                  查看全部
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.emptyDrafts}>
              <Text 
                variant="body1" 
                align="center" 
                color={colors.gray[500]}
              >
                暂无草稿作品
              </Text>
              <Text 
                variant="body2" 
                align="center" 
                color={colors.gray[400]}
                style={styles.emptySubtext}
              >
                选择创作类型，开始你的第一个作品
              </Text>
            </View>
          </ScrollView>
        </>
      </SafeAreaView>
    );
  }
  
  // 创作流程界面
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <ArrowLeft size={24} color={colors.gray[800]} />
        </TouchableOpacity>
        
        <Text variant="h4" weight="bold" style={styles.headerTitle}>
          {currentStep === 'select-material' && '选择素材'}
          {currentStep === 'select-template' && '选择模板'}
          {currentStep === 'edit' && (
            templateType === 'vlog' ? '创建文物Vlog' :
            templateType === 'drama' ? '创建历史短剧' :
            templateType === 'design' ? '创建文创设计' : '创建图文故事'
          )}
          {currentStep === 'publish' && '发布作品'}
        </Text>
        
        {currentStep === 'edit' && (
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={goToPublish}
          >
            <Text variant="body2" color={colors.primary[500]} weight="bold">
              下一步
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentWithPadding}
      >
        {/* 步骤1: 素材选择 */}
        {currentStep === 'select-material' && (
          <View style={styles.stepContainer}>
            <Text variant="body1" style={styles.stepDescription}>
              选择或上传文物素材，开始你的创作
            </Text>
            
            <MaterialSelector 
              onSelectMaterial={handleMaterialSelect}
              collectionItems={SAMPLE_COLLECTION_ITEMS}
            />
          </View>
        )}
        
        {/* 步骤2: 模板选择 */}
        {currentStep === 'select-template' && (
          <View style={styles.stepContainer}>
            <Text variant="body1" style={styles.stepDescription}>
              选择一个模板，AI将根据素材自动推荐适合的模板
            </Text>
            
            <TemplateSelector 
              category={templateType}
              artifactType="青铜器" // 这里应该从selectedMaterial中获取
              onSelectTemplate={handleTemplateSelect}
              selectedTemplateId={selectedTemplate?.id}
            />
          </View>
        )}
        
        {/* 步骤3: 编辑 */}
        {currentStep === 'edit' && (
          <View style={styles.stepContainer}>
            {/* 视频预览 */}
            <View style={styles.previewContainer}>
              <View style={styles.videoPreview}>
                <Text color={colors.white} align="center">
                  视频预览区
                </Text>
              </View>
            </View>
            
            {/* 时间轴 */}
            <View style={styles.timelineContainer}>
              <Text variant="caption" color={colors.gray[600]}>
                时间轴
              </Text>
            </View>
            
            {/* AI脚本生成 */}
            <View style={styles.sectionContainer}>
              <AIScriptGenerator
                onScriptGenerated={setGeneratedScript}
                artifactName="青铜器" // 应从selectedMaterial获取
                artifactType="青铜器"
                templateType={selectedTemplate?.id}
              />
            </View>
            
            {/* 滤镜和特效 */}
            <View style={styles.sectionContainer}>
              <FilterSelector
                onSelectFilter={setSelectedFilter}
                onSelectEffect={setSelectedEffect}
                selectedFilterId={selectedFilter?.id}
                selectedEffectId={selectedEffect?.id}
              />
            </View>
            
            {/* 音乐选择器 */}
            <View style={styles.sectionContainer}>
              <MusicSelector
                onSelectMusic={setSelectedMusic}
                selectedMusicId={selectedMusic?.id}
                templateType={selectedTemplate?.id}
              />
            </View>
          </View>
        )}
        
        {/* 步骤4: 发布 */}
        {currentStep === 'publish' && (
          <View style={styles.stepContainer}>
            <PublishSettings
              onPublish={handlePublish}
              suggestedTags={['青铜器', '文物故事', selectedTemplate?.name]}
              availableActivities={SAMPLE_ACTIVITIES}
              artifactType="青铜器" // 应从selectedMaterial获取
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.gray[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  nextButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  contentWithPadding: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  description: {
    marginBottom: spacing.md,
    color: colors.gray[700],
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyDrafts: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySubtext: {
    marginTop: spacing.xs,
  },
  stepContainer: {
    marginBottom: spacing.md,
  },
  stepDescription: {
    marginBottom: spacing.md,
    color: colors.gray[700],
  },
  previewContainer: {
    marginBottom: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoPreview: {
    aspectRatio: 16/9,
    backgroundColor: colors.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    height: 60,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  sectionContainer: {
    marginBottom: spacing.md,
  },
});