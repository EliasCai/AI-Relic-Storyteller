import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, shadows } from '@/constants/theme';

// 定义主题选项的接口
interface TopicOption {
  id: string;
  title: string;
  description: string;
  image: any; // 修改为接受任何类型，以支持require导入的图片
}

// 示例数据 - 在实际应用中会由API提供
const artifactData = {
  id: '1',
  name: '青花瓷龙纹碗',
  dynasty: '明朝',
  period: '永乐年间 (1403-1424)',
  image: require('@/assets/images/demo01.jpg'),
};

// 示例选题数据 - 在实际应用中会由API生成
const topicOptions = [
  {
    id: '1',
    title: '青花瓷龙纹碗的诞生之旅',
    description: '跟随匠人的双手，见证一件官窑瓷器从泥土到皇家宝器的蜕变过程',
    image: require('@/assets/images/demo02.png'),
  },
  {
    id: '2',
    title: '龙纹碗见证的明朝秘事',
    description: '一件皇家餐具，几段朝堂秘辛，透过纹饰了解明朝宫廷文化与权力交替',
    image: require('@/assets/images/demo03.png'),
  },
  {
    id: '3',
    title: '从青花瓷看东西方贸易交流',
    description: '它曾是海上丝绸之路的珍宝，见证了东西方文化的激烈碰撞与交融',
    image: require('@/assets/images/demo04.jpeg'),
  },
  {
    id: '4',
    title: '穿越时空的对话：古瓷器与现代科技',
    description: '通过现代科技手段探索古代制瓷工艺的奥秘，跨越600年的科技对话',
    image: require('@/assets/images/demo05.jpg'),
  },
];

export default function VideoCreationScreen() {
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null);
  
  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTopicSelect = (topic: TopicOption) => {
    setSelectedTopic(topic);
    // 进入到下一步 - 剧本预览
    router.push({
      pathname: '/scriptPreview',
      params: { 
        artifactId: artifactData.id,
        topicId: topic.id,
        topicTitle: topic.title
      }
    });
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text variant="body1" style={{ marginTop: spacing.md }}>
          正在为您构思故事主题...
        </Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Stack.Screen 
        options={{
          title: '选择故事主题',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color={colors.gray[800]} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.artifactInfoContainer}>
            <Image 
              source={artifactData.image}
              style={styles.artifactImage}
            />
            <View style={styles.artifactInfo}>
              <Text variant="h4" weight="bold">{artifactData.name}</Text>
              <Text variant="body2" color={colors.gray[600]}>
                {artifactData.dynasty} · {artifactData.period}
              </Text>
            </View>
          </View>
          
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            为您推荐的故事主题
          </Text>
          <Text variant="body1" color={colors.gray[600]} style={styles.sectionDescription}>
            基于文物特点，我们为您推荐了以下几个有趣的故事方向，请选择一个您感兴趣的主题
          </Text>
        </View>
        
        <View style={styles.topicList}>
          {topicOptions.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicCard}
              onPress={() => handleTopicSelect(topic)}
            >
              <Image 
                source={topic.image} 
                style={styles.topicImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.topicGradient}
              >
                <Text variant="h4" weight="bold" color={colors.white} style={styles.topicTitle}>
                  {topic.title}
                </Text>
                <Text variant="body2" color={colors.white} style={styles.topicDescription}>
                  {topic.description}
                </Text>
                <View style={styles.selectButton}>
                  <ChevronRight color={colors.white} size={20} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  header: {
    padding: spacing.lg,
  },
  artifactInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    ...shadows.sm,
  },
  artifactImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  artifactInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    marginBottom: spacing.lg,
  },
  topicList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  topicCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  topicImage: {
    width: '100%',
    height: '100%',
  },
  topicGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  topicTitle: {
    marginBottom: spacing.xs,
  },
  topicDescription: {
    marginBottom: spacing.sm,
  },
  selectButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 