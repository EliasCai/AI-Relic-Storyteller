import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView 
} from 'react-native';
import { Film, ImagePlus, Video, Wand as Wand2 } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import CreationOption from '@/components/create/CreationOption';
import Text from '@/components/ui/Text';
import { colors, spacing } from '@/constants/theme';

export default function CreateScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // 处理发布事件
  const handlePublish = () => {
    console.log('Published');
  };
  
  // 根据路由参数决定显示哪个创作类型
  function renderEditor() {
    const { templateType } = useLocalSearchParams();
    
    if (templateType === 'vlog') {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text variant="h3" weight="bold">
              文物Vlog编辑器
            </Text>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.templateSection}>
              <Text variant="h4" style={styles.sectionTitle}>
                选择模板
              </Text>
              {/* 模板选择组件 */}
            </View>
            
            <View style={styles.editorSection}>
              {/* 视频编辑组件 */}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
    
    // 默认显示创作类型选择界面
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
          onPress={() => router.push({
            pathname: '/create',
            params: { templateType: 'vlog' }
          })}
        />
        <CreationOption
          title="历史短剧"
          description="将文物置于历史场景中，重现其使用场景"
          icon={<Video size={24} color={colors.white} />}
          gradientColors={[colors.secondary[400], colors.secondary[600]]}
          onPress={() => console.log('Create Drama')}
        />
        <CreationOption
          title="文创设计"
          description="基于文物元素创作现代设计作品"
          icon={<Wand2 size={24} color={colors.white} />}
          gradientColors={[colors.accent[400], colors.accent[600]]}
          onPress={() => console.log('Create Design')}
        />
        <CreationOption
          title="图文故事"
          description="用精美图文讲述文物背后的文化与历史"
          icon={<ImagePlus size={24} color={colors.white} />}
          gradientColors={[colors.teal[400], colors.teal[600]]}
          onPress={() => console.log('Create Story')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
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
});
  return renderEditor();
}