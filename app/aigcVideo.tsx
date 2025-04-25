import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RefreshCw,
  MessageSquare,
  Share2,
  Heart,
  Wand2,
} from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing } from '@/constants/theme';

// 视频数据
const videoData = {
  artifactId: '1', // 文物ID，用于关联到具体文物
  title: '青花瓷龙纹碗的前世今生',
  description: '我是明代永乐年间的青花瓷龙纹碗，出生于景德镇御窑厂...',
  videoUrl: require('@/assets/videos/demo.mp4'), // 本地视频文件
};

export default function AIGCVideoScreen() {
  const params = useLocalSearchParams();
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showEndActions, setShowEndActions] = useState(false);
  
  const videoRef = useRef(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const controlsTimeout = useRef(null);
  
  // 模拟视频生成过程
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          const newProgress = prev + 0.01;
          if (newProgress >= 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
            }, 500);
            return 1;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);
  
  // 自动隐藏控制栏
  useEffect(() => {
    if (isPlaying && showControls) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => {
        if (controlsTimeout.current) {
          clearTimeout(controlsTimeout.current);
        }
      };
    }
  }, [isPlaying, showControls]);
  
  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis / 1000);
      setPosition(status.positionMillis / 1000);
      setIsPlaying(status.isPlaying);
      
      // 检测视频是否播放结束
      if (status.didJustFinish) {
        setShowEndActions(true);
        setIsPlaying(false);
      }
    }
  };
  
  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
        setShowEndActions(false);
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
    }
  };
  
  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
      setShowControls(true);
    }
  };
  
  const handleVideoPress = () => {
    setShowControls(!showControls);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
  };
  
  const handleSliderChange = async (value) => {
    if (videoRef.current) {
      const newPosition = value * duration;
      await videoRef.current.setPositionAsync(newPosition * 1000);
      setPosition(newPosition);
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleReplay = async () => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(0);
      await videoRef.current.playAsync();
      setIsPlaying(true);
      setShowEndActions(false);
    }
  };
  
  const handleChatPress = () => {
    console.log('与文物对话');
    router.push({
      pathname: '/chat',
      params: { artifactId: videoData.artifactId || '1' }
    });
  };
  
  const handleSharePress = () => {
    console.log('分享视频');
    // 在实际应用中，这里会调用分享API
  };
  
  const handleCreatePress = () => {
    console.log('以此为灵感创作');
    router.push({
      pathname: '/create',
      params: { 
        artifactId: videoData.artifactId || '1',
        templateType: 'vlog',
        sourceVideo: videoData.videoUrl
      }
    });
  };
  
  if (isGenerating) {
    return (
      <SafeAreaView style={styles.generatingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={colors.white} size={24} />
        </TouchableOpacity>
        
        <View style={styles.generatingContent}>
          <Text variant="h3" weight="bold" color={colors.white} align="center">
            正在生成专属视频
          </Text>
          
          <Text 
            variant="body1" 
            color={colors.white} 
            align="center"
            style={styles.generatingDescription}
          >
            AI正在为您的文物创作第一人称视角的科普短视频，请稍候...
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: `${generationProgress * 100}%` }
                ]}
              />
            </View>
            <Text variant="body2" color={colors.white}>
              {Math.round(generationProgress * 100)}%
            </Text>
          </View>
          
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={handleVideoPress}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={videoData.videoUrl}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoad={() => setIsVideoReady(true)}
          onReadyForDisplay={() => setIsVideoReady(true)}
          useNativeControls={false}
        />
        
        {!isVideoReady && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        )}
        
        {showControls && (
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.controlsOverlay}
          >
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft color={colors.white} size={24} />
              </TouchableOpacity>
              
              <Text variant="h4" weight="bold" color={colors.white} style={styles.videoTitle}>
                {videoData.title}
              </Text>
            </View>
            
            <View style={styles.centerControls}>
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause color={colors.white} size={32} />
                ) : (
                  <Play color={colors.white} size={32} />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.bottomControls}>
              <View style={styles.progressRow}>
                <Text variant="caption" color={colors.white}>
                  {formatTime(position)}
                </Text>
                
                <View style={styles.sliderContainer}>
                  <View style={styles.slider}>
                    <View 
                      style={[
                        styles.sliderFill, 
                        { width: `${(position / duration) * 100}%` }
                      ]}
                    />
                    <TouchableOpacity
                      style={[
                        styles.sliderThumb,
                        { left: `${(position / duration) * 100}%` }
                      ]}
                      onPress={() => {}}
                    />
                  </View>
                </View>
                
                <Text variant="caption" color={colors.white}>
                  {formatTime(duration)}
                </Text>
              </View>
              
              <View style={styles.controlButtons}>
                <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                  {isMuted ? (
                    <VolumeX color={colors.white} size={20} />
                  ) : (
                    <Volume2 color={colors.white} size={20} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton}>
                  <Maximize color={colors.white} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        )}
        
        {showEndActions && (
          <View style={styles.endActionsOverlay}>
            <Text variant="h3" weight="bold" color={colors.white} align="center">
              视频播放结束
            </Text>
            
            <View style={styles.endActionsButtons}>
              <Button
                title="重新播放"
                icon={<RefreshCw size={20} color={colors.white} />}
                containerStyle={styles.endActionButton}
                onPress={handleReplay}
              />
              
              <Button
                title="与TA对话"
                icon={<MessageSquare size={20} color={colors.white} />}
                containerStyle={styles.endActionButton}
                onPress={handleChatPress}
              />
              
              <Button
                title="分享给朋友"
                icon={<Share2 size={20} color={colors.white} />}
                containerStyle={styles.endActionButton}
                onPress={handleSharePress}
              />
              
              <Button
                title="以此为灵感创作"
                icon={<Wand2 size={20} color={colors.white} />}
                containerStyle={styles.endActionButton}
                onPress={handleCreatePress}
              />
              
              <Button
                title={isLiked ? "已点赞" : "给TA点赞"}
                icon={<Heart size={20} color={colors.white} fill={isLiked ? colors.secondary[500] : 'none'} />}
                containerStyle={styles.endActionButton}
                onPress={() => setIsLiked(!isLiked)}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  generatingContainer: {
    flex: 1,
    backgroundColor: colors.primary[700],
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    zIndex: 10,
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  generatingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  generatingDescription: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  progressContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  loadingIndicator: {
    marginTop: spacing.xl,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  videoTitle: {
    marginLeft: spacing.xl,
    flex: 1,
  },
  centerControls: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    marginBottom: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  slider: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.white,
    position: 'absolute',
    top: -4,
    marginLeft: -6,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  controlButton: {
    marginLeft: spacing.md,
    padding: spacing.xs,
  },
  endActionsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  endActionsButtons: {
    marginTop: spacing.xl,
    width: '100%',
  },
  endActionButton: {
    marginBottom: spacing.md,
  },
});