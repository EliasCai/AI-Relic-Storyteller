import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Video, Mic, Clapperboard, Play, Music } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import { colors, spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

const generationSteps = [
  {
    id: '1',
    title: '处理分镜画面',
    description: '正在优化分镜图像质量并为后续处理做准备...',
    icon: Video,
  },
  {
    id: '2',
    title: '生成旁白语音',
    description: '使用您选择的声音风格合成旁白音频...',
    icon: Mic,
  },
  {
    id: '3',
    title: '混合背景音乐',
    description: '调整背景音乐音量并与旁白混合...',
    icon: Music,
  },
  {
    id: '4',
    title: '合成最终视频',
    description: '将画面、旁白和音乐合成为完整视频...',
    icon: Clapperboard,
  },
  {
    id: '5',
    title: '完成',
    description: '您的专属文物故事视频已生成完毕！',
    icon: Play,
  },
];

export default function FinalGenerationScreen() {
  const params = useLocalSearchParams();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressAnimation = new Animated.Value(0);
  
  // 模拟生成进度
  useEffect(() => {
    const totalSteps = generationSteps.length;
    
    if (currentStepIndex < totalSteps - 1) {
      // 为每个步骤设置一个随机的完成时间(3-7秒)
      const stepDuration = Math.random() * 4000 + 3000;
      
      // 启动进度动画
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: stepDuration,
        useNativeDriver: false,
      }).start();
      
      // 定时更新进度
      const interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 0.05 + 0.01;
          const newProgress = prev + increment;
          if (newProgress >= 1) {
            clearInterval(interval);
            // 当前步骤完成，进入下一步
            setTimeout(() => {
              progressAnimation.setValue(0);
              setProgress(0);
              setCurrentStepIndex((prev) => prev + 1);
            }, 500);
            return 1;
          }
          return newProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    } else if (currentStepIndex === totalSteps - 1) {
      // 所有步骤完成，短暂展示完成状态后跳转
      setTimeout(() => {
        router.push({
          pathname: '/aigcVideo',
          params: { 
            artifactId: params.artifactId,
            generated: 'true'
          }
        });
      }, 2000);
    }
  }, [currentStepIndex]);
  
  const renderSteps = () => {
    return generationSteps.map((step, index) => {
      const isCurrentStep = index === currentStepIndex;
      const isPastStep = index < currentStepIndex;
      const Icon = step.icon;
      
      return (
        <View 
          key={step.id} 
          style={[
            styles.stepItem,
            isPastStep && styles.pastStep,
            isCurrentStep && styles.currentStep
          ]}
        >
          <View 
            style={[
              styles.stepIconContainer, 
              isPastStep && styles.pastStepIcon,
              isCurrentStep && styles.currentStepIcon
            ]}
          >
            <Icon 
              size={24} 
              color={isPastStep || isCurrentStep ? colors.white : colors.gray[400]} 
            />
          </View>
          
          <View style={styles.stepContent}>
            <Text 
              variant="body1" 
              weight={isCurrentStep ? "bold" : "regular"}
              color={isCurrentStep ? colors.primary[700] : (isPastStep ? colors.gray[700] : colors.gray[400])}
            >
              {step.title}
            </Text>
            
            {isCurrentStep && (
              <Text variant="body2" color={colors.gray[600]} style={styles.stepDescription}>
                {step.description}
              </Text>
            )}
            
            {isCurrentStep && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      { width: progressAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%']
                        })
                      }
                    ]}
                  />
                </View>
                <Text variant="caption" color={colors.gray[600]}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />
      
      <View style={styles.header}>
        <Text variant="h3" weight="bold" color={colors.white} align="center">
          正在生成专属视频
        </Text>
        
        <Text 
          variant="body1" 
          color={colors.white} 
          align="center"
          style={styles.headerDescription}
        >
          请稍候，我们正在按照您的选择生成文物故事视频
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.stepsContainer}>
          {renderSteps()}
        </View>
        
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
        
        <Text variant="body1" color={colors.gray[600]} align="center" style={styles.note}>
          视频生成需要1-2分钟，期间请勿关闭应用
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[700],
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  headerDescription: {
    marginTop: spacing.md,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: spacing.xl,
  },
  stepsContainer: {
    marginTop: spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    opacity: 0.6,
  },
  currentStep: {
    opacity: 1,
  },
  pastStep: {
    opacity: 0.8,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  currentStepIcon: {
    backgroundColor: colors.primary[500],
  },
  pastStepIcon: {
    backgroundColor: colors.primary[300],
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepDescription: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  loadingIndicator: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  note: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
}); 