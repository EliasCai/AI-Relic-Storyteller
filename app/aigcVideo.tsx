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
  Alert,
  Share,
  Platform,
  ToastAndroid,
  ScrollView,
  Image,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
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
  Download,
  Edit3,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Info,
  ChevronDown,
  User,
} from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing } from '@/constants/theme';

// 视频数据
const videoData = {
  artifactId: '1', // 文物ID，用于关联到具体文物
  title: '青花瓷龙纹碗的前世今生',
  description: '博物馆，纪念馆，动物园的深度爱好者🤗',
  videoUrl: require('@/assets/videos/demo03.mp4'), // 本地视频文件
  author: '喜羊看世界',
  avatar: require('@/assets/images/avatar01.png'),
  followers: '2.6万粉丝',
  views: '52.7万',
  likes: 4658,
  favorites: 4529,
  shares: 181,
  comments: 118,
  date: '2023年6月27日 07:26'
};

// 模拟评论数据
const comments = [
  { 
    id: '1', 
    user: '历史爱好者', 
    avatar: 'https://i.pravatar.cc/150?img=1', 
    content: '这个视频太棒了！让我对青花瓷有了更深入的了解！',
    likes: 32,
    time: '3小时前'
  },
  { 
    id: '2', 
    user: '瓷器收藏家', 
    avatar: 'https://i.pravatar.cc/150?img=2', 
    content: '视频中关于釉色的说明非常专业，学到了很多专业知识。',
    likes: 17,
    time: '昨天'
  },
  { 
    id: '3', 
    user: '博物馆志愿者', 
    avatar: 'https://i.pravatar.cc/150?img=3', 
    content: '我在博物馆就见过类似的藏品，通过这个视频了解了更多背后的故事！',
    likes: 24,
    time: '3天前'
  },
];

export default function AIGCVideoScreen() {
  const params = useLocalSearchParams();
  const [isGenerating, setIsGenerating] = useState(false); // 修改为false以直接显示视频
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // 自动播放
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showEndActions, setShowEndActions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedToGallery, setSavedToGallery] = useState(false);
  const [activeTab, setActiveTab] = useState('简介');
  const [localLikes, setLocalLikes] = useState(videoData.likes);
  const [localDislikes, setLocalDislikes] = useState(0);
  const [localFavorites, setLocalFavorites] = useState(videoData.favorites);
  const [expanded, setExpanded] = useState(false);
  
  const videoRef = useRef<Video>(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // 检查是否从生成页面进入
    if (params.generated === 'true') {
      setIsGenerating(false);
    }
    
    // 请求媒体库权限
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('需要媒体库访问权限才能保存视频');
      }
    })();
  }, [params]);
  
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
  
  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      setPosition(status.positionMillis ? status.positionMillis / 1000 : 0);
      setIsPlaying(status.isPlaying);
      
      // 检测视频是否播放结束
      if (status.didJustFinish) {
        setIsPlaying(false);
        setShowControls(true);
      }
    }
  };
  
  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
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
    togglePlayPause();
  };
  
  const handleVideoContainerPress = () => {
    setShowControls(!showControls);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
  };
  
  const handleSliderChange = async (value: number) => {
    if (videoRef.current) {
      const newPosition = value * duration;
      await videoRef.current.setPositionAsync(newPosition * 1000);
      setPosition(newPosition);
    }
  };
  
  const formatTime = (seconds: number) => {
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
  
  const handleSharePress = async () => {
    try {
      const result = await Share.share({
        title: `${videoData.title}`,
        message: `查看这个有趣的文物故事视频：${videoData.title}`,
        url: "https://example.com/shareable-video-link", // 在实际应用中替换为真实的分享链接
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // 分享成功，带有活动类型
          console.log(`分享成功，活动类型: ${result.activityType}`);
        } else {
          // 分享成功，没有活动类型
          console.log('基本分享成功');
        }
      } else if (result.action === Share.dismissedAction) {
        // 分享被取消
        console.log('分享被取消');
      }
    } catch (error) {
      Alert.alert('分享失败', error instanceof Error ? error.message : '未知错误');
    }
  };
  
  const handleSavePress = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      
      // 在实际应用中，这里需要获取实际视频的URI
      // 对于演示目的，我们模拟保存过程
      
      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟保存成功
      if (Platform.OS === 'android') {
        ToastAndroid.show('视频已保存到您的相册', ToastAndroid.SHORT);
      } else {
        Alert.alert('保存成功', '视频已保存到您的相册');
      }
      
      setSavedToGallery(true);
    } catch (error) {
      Alert.alert('保存失败', error instanceof Error ? error.message : '未知错误');
    } finally {
      setIsSaving(false);
    }
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
  
  const handleBackToEdit = () => {
    // 返回到编辑页面
    router.push({
      pathname: '/storyboard',
      params: { 
        artifactId: videoData.artifactId,
        scriptId: params.scriptId || '1',
        styleId: params.styleId || '1',
        characters: params.characters || '1'
      }
    });
  };
  
  const handleLike = () => {
    if (isLiked) {
      setLocalLikes((prev: number) => prev - 1);
    } else {
      setLocalLikes((prev: number) => prev + 1);
      if (isDisliked) {
        setIsDisliked(false);
        setLocalDislikes((prev: number) => prev - 1);
      }
    }
    setIsLiked(!isLiked);
  };
  
  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) {
      setIsLiked(false);
      setLocalLikes((prev: number) => prev - 1);
    }
  };
  
  const handleFavorite = () => {
    if (isFavorited) {
      setLocalFavorites((prev: number) => prev - 1);
    } else {
      setLocalFavorites((prev: number) => prev + 1);
    }
    setIsFavorited(!isFavorited);
  };
  
  const handleFollowPress = () => {
    Alert.alert('关注成功', '您已成功关注该创作者');
  };
  
  const toggleDescription = () => {
    setExpanded(!expanded);
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      <ScrollView style={styles.scrollContainer}>
        {/* 视频播放区域 */}
        <View style={styles.videoSection}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.videoContainer}
            onPress={handleVideoContainerPress}
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
              shouldPlay={true}
            />
            
            {!isVideoReady && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.white} />
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.backButtonOverlay}
              onPress={() => router.back()}
            >
              <ArrowLeft color={colors.white} size={24} />
            </TouchableOpacity>
            
            {showControls && (
              <View style={styles.controlsOverlay}>
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
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* 视频信息区域 */}
        <View style={styles.infoSection}>
          <Text variant="h4" weight="bold" style={styles.videoTitle}>
            {videoData.title}
          </Text>
          
          <Text variant="body2" color={colors.gray[600]} style={styles.videoStats}>
            {videoData.views} 次观看 · {videoData.date}
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButtonItem}
              onPress={handleLike}
            >
              <ThumbsUp 
                size={24} 
                color={isLiked ? colors.primary[500] : colors.gray[700]} 
                fill={isLiked ? colors.primary[500] : 'transparent'}
              />
              <Text 
                variant="caption" 
                color={isLiked ? colors.primary[500] : colors.gray[700]}
              >
                {localLikes}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButtonItem}
              onPress={handleSharePress}
            >
              <Share2 size={24} color={colors.gray[700]} />
              <Text variant="caption" color={colors.gray[700]}>
                {videoData.shares}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButtonItem}
              onPress={handleFavorite}
            >
              <Bookmark 
                size={24} 
                color={isFavorited ? colors.primary[500] : colors.gray[700]} 
                fill={isFavorited ? colors.primary[500] : 'transparent'}
              />
              <Text 
                variant="caption" 
                color={isFavorited ? colors.primary[500] : colors.gray[700]}
              >
                {localFavorites}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButtonItem}
              onPress={handleSavePress}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.primary[500]} />
              ) : (
                <>
                  <Download 
                    size={24} 
                    color={savedToGallery ? colors.primary[500] : colors.gray[700]} 
                  />
                  <Text 
                    variant="caption" 
                    color={savedToGallery ? colors.primary[500] : colors.gray[700]}
                  >
                    {savedToGallery ? '已保存' : '保存'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.authorSection}>
            <View style={styles.authorInfo}>
              <Image 
                source={videoData.avatar}
                style={styles.avatar} 
              />
              <View style={styles.authorTextInfo}>
                <Text variant="body1" weight="bold">
                  {videoData.author}
                </Text>
                <Text variant="caption" color={colors.gray[600]}>
                  {videoData.followers}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.followButton}
              onPress={handleFollowPress}
            >
              <Text variant="body2" weight="medium" color={colors.white}>
                关注
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.descriptionContainer}
            onPress={toggleDescription}
          >
            <Text 
              variant="body2" 
              color={colors.gray[800]}
              numberOfLines={expanded ? undefined : 2}
              style={styles.descriptionText}
            >
              {videoData.description}
              {'\n\n'}
              这件青花瓷龙纹碗历经600余年，见证了明代官窑制瓷工艺的辉煌。碗内外壁绘有龙纹图案，青花发色纯正，釉面莹润。龙纹线条流畅有力，刻画细腻，是明代永乐时期宫廷御用瓷器的代表作品。这类瓷器不仅具有极高的艺术价值，也反映了当时先进的制瓷技术和审美风尚。
            </Text>
            
            <View style={styles.expandButton}>
              <ChevronDown 
                size={20} 
                color={colors.gray[600]} 
                style={{ 
                  transform: [{ rotate: expanded ? '180deg' : '0deg' }]
                }}
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[
                styles.tabButton,
                activeTab === '简介' && styles.activeTabButton
              ]}
              onPress={() => setActiveTab('简介')}
            >
              <Text 
                variant="body2" 
                weight={activeTab === '简介' ? 'bold' : 'regular'}
                color={activeTab === '简介' ? colors.primary[500] : colors.gray[700]}
              >
                简介
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tabButton,
                activeTab === '评论' && styles.activeTabButton
              ]}
              onPress={() => setActiveTab('评论')}
            >
              <Text 
                variant="body2" 
                weight={activeTab === '评论' ? 'bold' : 'regular'}
                color={activeTab === '评论' ? colors.primary[500] : colors.gray[700]}
              >
                评论 {videoData.comments}
              </Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === '评论' && (
            <View style={styles.commentsSection}>
              {comments.map(comment => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image 
                    source={{ uri: comment.avatar }} 
                    style={styles.commentAvatar} 
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text variant="body2" weight="bold">
                        {comment.user}
                      </Text>
                      <Text variant="caption" color={colors.gray[500]}>
                        {comment.time}
                      </Text>
                    </View>
                    <Text variant="body2" color={colors.gray[800]}>
                      {comment.content}
                    </Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentAction}>
                        <ThumbsUp size={16} color={colors.gray[500]} />
                        <Text variant="caption" color={colors.gray[500]} style={{ marginLeft: 4 }}>
                          {comment.likes}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentAction}>
                        <MessageCircle size={16} color={colors.gray[500]} />
                        <Text variant="caption" color={colors.gray[500]} style={{ marginLeft: 4 }}>
                          回复
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {activeTab === '简介' && (
            <View style={styles.actionButtonsLarge}>
              <TouchableOpacity 
                style={styles.largeActionButton}
                onPress={handleSharePress}
              >
                <View style={styles.largeActionButtonIcon}>
                  <Share2 size={24} color={colors.white} />
                </View>
                <Text variant="body2" weight="medium">
                  分享
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.largeActionButton}
                onPress={handleSavePress}
                disabled={isSaving}
              >
                <View style={styles.largeActionButtonIcon}>
                  {isSaving ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Download size={24} color={colors.white} />
                  )}
                </View>
                <Text variant="body2" weight="medium">
                  {savedToGallery ? '已保存' : '保存'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.largeActionButton}
                onPress={handleBackToEdit}
              >
                <View style={styles.largeActionButtonIcon}>
                  <Edit3 size={24} color={colors.white} />
                </View>
                <Text variant="body2" weight="medium">
                  编辑
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.white,
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
  videoSection: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: colors.black,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    justifyContent: 'center',
    position: 'relative',
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
  backButtonOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 10,
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  centerControls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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
    width: '100%',
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
  infoSection: {
    padding: spacing.md,
  },
  videoTitle: {
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  videoStats: {
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  actionButtonItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  authorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  authorTextInfo: {
    justifyContent: 'center',
  },
  followButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  descriptionContainer: {
    marginBottom: spacing.md,
  },
  descriptionText: {
    lineHeight: 20,
  },
  expandButton: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tabButton: {
    marginRight: spacing.xl,
    paddingVertical: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: colors.primary[500],
  },
  commentsSection: {
    marginTop: spacing.sm,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionButtonsLarge: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.md,
  },
  largeActionButton: {
    alignItems: 'center',
  },
  largeActionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
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