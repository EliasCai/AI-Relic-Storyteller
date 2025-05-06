import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, shadows } from '@/constants/theme';

// 示例剧本数据 - 在实际应用中会由API生成
const sampleScript = {
  title: '青花瓷龙纹碗的诞生之旅',
  scenes: [
    {
      id: '1',
      title: '开场：原料的起源',
      content: '我是一件明朝永乐年间的青花瓷龙纹碗，我的故事始于江西景德镇的瓷土矿山。那里的高岭土纯白细腻，是制作上等瓷器的绝佳原料。一个雨后的清晨，矿工小李挖掘到了一块品质极佳的高岭土，它洁白如玉，质地细腻，这就是我未来身体的原材料。',
    },
    {
      id: '2',
      title: '场景二：匠人的塑造',
      content: '高岭土经过多次淘洗、沉淀、晾晒后，被送到了御窑厂。那里的首席陶工张大师接过这团泥料，在转轮上娴熟地塑造。他的手指仿佛有魔力，轻轻一捏，我的碗身就开始成形。张大师对每一个细节都极为考究，确保我的弧度完美，厚度均匀，这样才能承载帝王的饮食。',
    },
    {
      id: '3',
      title: '场景三：青花的绘制',
      content: '成型后的我被送到了彩绘室。画师吴先生手持细笔，蘸取从波斯进口的珍贵钴料，在我洁白的表面上描绘龙纹。每一笔都凝聚着他的心血，龙的鳞片、爪子、须髯，无不栩栩如生。他告诉徒弟："龙是皇权的象征，绘制在御用餐具上，一定要威武霸气，却又不失优雅。"',
    },
    {
      id: '4',
      title: '场景四：窑火的淬炼',
      content: '彩绘完成后，我和其他瓷器一起被小心翼翼地放入大窑中。窑工们日夜看守，精确控制着火候。在1300度的高温中，我经历了脱胎换骨的考验。钴料在高温中渗入釉层，呈现出深沉内敛的蓝色，与洁白的胎体形成鲜明对比。这段煎熬让我变得更加坚韧。',
    },
    {
      id: '5',
      title: '场景五：皇宫的旅程',
      content: '出窑后，监造太监严格检查每件瓷器。我因制作精良、图案吉祥，被选中送往皇宫。一路上，我被精心包裹，由专人护送，穿过山川河流，终于抵达紫禁城。在宫中，我被用来盛放皇帝的珍馐佳肴，见证了许多重要的宫廷宴会和历史时刻。',
    },
    {
      id: '6',
      title: '结尾：博物馆的新生',
      content: '几百年后的今天，我成为了博物馆中珍贵的文物，向人们诉说着明代官窑的辉煌工艺和历史。每位驻足欣赏我的观众，都能通过我这件小小的瓷碗，窥见一个帝国的艺术成就和文化底蕴。',
    },
  ]
};

export default function ScriptPreviewScreen() {
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [script, setScript] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setScript(sampleScript);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRegenerate = () => {
    setIsRegenerating(true);
    
    // 模拟重新生成
    setTimeout(() => {
      // 在实际应用中，这里会请求API重新生成剧本
      setIsRegenerating(false);
    }, 2000);
  };
  
  const handleContinue = () => {
    // 进入到下一步 - 风格与角色选择
    router.push({
      pathname: '/styleAndCharacter',
      params: { 
        artifactId: params.artifactId,
        topicId: params.topicId,
        scriptId: '1' // 在实际应用中这会是真实的剧本ID
      }
    });
  };
  
  const handleBack = () => {
    router.back();
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text variant="body1" style={{ marginTop: spacing.md }}>
          正在为您创作故事剧本...
        </Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Stack.Screen 
        options={{
          title: '故事剧本预览',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack}>
              <ArrowLeft color={colors.gray[800]} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="h2" weight="bold" style={styles.scriptTitle}>
            {script.title}
          </Text>
          
          <Text variant="body1" color={colors.gray[600]} style={styles.scriptIntro}>
            以下是我们为这个故事生成的剧本概要，您可以预览并决定是否满意
          </Text>
        </View>
        
        <View style={styles.scriptContainer}>
          {script.scenes.map((scene, index) => (
            <View key={scene.id} style={styles.sceneItem}>
              <View style={styles.sceneHeader}>
                <View style={styles.sceneNumber}>
                  <Text variant="caption" weight="bold" color={colors.white}>
                    {index + 1}
                  </Text>
                </View>
                <Text variant="h4" weight="bold" style={styles.sceneTitle}>
                  {scene.title}
                </Text>
              </View>
              
              <Text variant="body1" style={styles.sceneContent}>
                {scene.content}
              </Text>
              
              {index < script.scenes.length - 1 && (
                <View style={styles.sceneDivider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="换个故事主题"
          variant="outline"
          onPress={handleBack}
          containerStyle={styles.backButton}
        />
        
        <Button
          title="重新生成剧本"
          variant="outline"
          icon={<RefreshCw size={18} color={colors.primary[500]} />}
          onPress={handleRegenerate}
          containerStyle={styles.regenerateButton}
          loading={isRegenerating}
        />
        
        <Button
          title="满意，下一步"
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  scriptTitle: {
    marginBottom: spacing.md,
  },
  scriptIntro: {
    marginBottom: spacing.lg,
  },
  scriptContainer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  sceneItem: {
    marginBottom: spacing.lg,
  },
  sceneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sceneNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  sceneTitle: {
    flex: 1,
  },
  sceneContent: {
    lineHeight: 24,
    paddingLeft: 32, // 与场景编号对齐
  },
  sceneDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginTop: spacing.lg,
    marginLeft: 32,
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
  regenerateButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  continueButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
}); 