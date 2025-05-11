import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft,
  MessageSquare,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Video,
  Info
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Placeholder data - in a real app, this would come from your API
const artifactData = {
  id: '1',
  name: '青花瓷龙纹碗',
  dynasty: '明朝',
  period: '永乐年间 (1403-1424)',
  image: require('@/assets/images/demo01.jpg'),
  details: {
    material: '瓷器',
    size: '高12.5厘米，口径18厘米',
    location: '景德镇御窑遗址',
    collection: '故宫博物院',
    features: '器形端庄，胎质细腻，釉色莹润。外壁绘青花龙纹，龙姿矫健，气势磅礴。内底绘青花缠枝莲纹，笔法流畅自然。',
  },
};

export default function ArtifactScreen() {
  const params = useLocalSearchParams();
  const [showDetails, setShowDetails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={styles.scrollView} bounces={false}>
        {/* 文物高清图片区域 */}
        <View style={styles.imageContainer}>
          <Image
            source={artifactData.image}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.imageGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color={colors.white} size={24} />
            </TouchableOpacity>
          </LinearGradient>
          
          {/* 文物名称浮动在图片上 */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.bottomGradient}
          >
            <Text variant="h1" weight="bold" style={styles.heroTitle} color={colors.white}>
              {artifactData.name}
            </Text>
            <Text variant="h4" color={colors.white} style={styles.heroPeriod}>
              {artifactData.dynasty} · {artifactData.period}
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.content}>
          {/* 核心信息卡片 */}
          <View style={styles.coreInfoCard}>
            <View style={styles.coreInfoRow}>
              <View style={styles.coreInfoItem}>
                <Text variant="caption" color={colors.gray[500]}>材质</Text>
                <Text variant="body2" weight="medium">{artifactData.details.material}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.coreInfoItem}>
                <Text variant="caption" color={colors.gray[500]}>出土地点</Text>
                <Text variant="body2" weight="medium">{artifactData.details.location}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.coreInfoItem}>
                <Text variant="caption" color={colors.gray[500]}>收藏单位</Text>
                <Text variant="body2" weight="medium">{artifactData.details.collection}</Text>
              </View>
            </View>
          </View>
          
          {/* 醒目的行动召唤按钮区域 */}
          <View style={styles.actionButtonsContainer}>
            <Text variant="h3" weight="bold" style={styles.actionTitle}>
              探索{artifactData.name}的故事
            </Text>
            
            {/* 主要行动按钮 - 生成文物故事视频 */}
            <TouchableOpacity 
              style={styles.primaryActionButton}
              onPress={() => {
                console.log('生成文物故事视频');
                router.push({
                  pathname: '/videoCreation',
                  params: { artifactId: artifactData.id }
                });
              }}
            >
              <LinearGradient
                colors={[colors.primary[400], colors.primary[600]]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.primaryActionGradient}
              >
                <Video size={24} color={colors.white} />
                <Text variant="h4" weight="bold" color={colors.white} style={{marginLeft: spacing.md}}>
                  生成文物故事视频
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* 次要行动按钮 - 与文物对话 */}
            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={() => {
                console.log('与文物对话');
                router.push({
                  pathname: '/chat',
                  params: { artifactId: artifactData.id }
                });
              }}
            >
              <MessageSquare size={24} color={colors.primary[500]} />
              <Text variant="h4" weight="bold" color={colors.primary[500]} style={{marginLeft: spacing.md}}>
                与{artifactData.name.length > 4 ? artifactData.name.substring(0, 4) : artifactData.name}聊聊
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* 详细图文资料入口 */}
          <TouchableOpacity
            style={styles.detailsCard}
            onPress={() => setShowDetails(!showDetails)}
          >
            <View style={styles.detailsHeader}>
              <Text variant="h4" weight="bold">
                详细图文资料
              </Text>
              {showDetails ? (
                <ChevronUp size={20} color={colors.gray[500]} />
              ) : (
                <ChevronDown size={20} color={colors.gray[500]} />
              )}
            </View>

            {showDetails && (
              <View style={styles.detailsContent}>
                <View style={styles.detailRow}>
                  <Text variant="body2" color={colors.gray[500]}>
                    尺寸
                  </Text>
                  <Text variant="body2">{artifactData.details.size}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text variant="body2" color={colors.gray[500]}>
                    特征
                  </Text>
                  <Text
                    variant="body2"
                    style={{ flex: 1, marginLeft: spacing.md }}
                  >
                    {artifactData.details.features}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text variant="body2" color={colors.gray[500]}>
                    历史背景
                  </Text>
                  <Text
                    variant="body2"
                    style={{ flex: 1, marginLeft: spacing.md }}
                  >
                    明代永乐时期是中国瓷器发展的黄金时期之一，青花瓷工艺达到了前所未有的高度。这件青花瓷龙纹碗是永乐官窑的代表作品，体现了当时精湛的制瓷工艺和皇家审美。
                  </Text>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text variant="body2" color={colors.gray[500]}>
                    文化价值
                  </Text>
                  <Text
                    variant="body2"
                    style={{ flex: 1, marginLeft: spacing.md }}
                  >
                    作为明代官窑精品，此碗不仅具有极高的艺术价值，更是研究明代宫廷文化、审美取向和制瓷工艺的重要实物资料。
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
          
          {/* 快捷操作区域 */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => setIsLiked(!isLiked)}
            >
              <Heart
                size={24}
                color={isLiked ? colors.secondary[500] : colors.gray[500]}
                fill={isLiked ? colors.secondary[500] : 'none'}
              />
              <Text
                variant="caption"
                color={isLiked ? colors.secondary[500] : colors.gray[500]}
                style={styles.quickActionText}
              >
                收藏
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <Share2 size={24} color={colors.gray[500]} />
              <Text
                variant="caption"
                color={colors.gray[500]}
                style={styles.quickActionText}
              >
                分享
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width * 1.1, // 更大的图片区域
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.md,
    marginTop: Platform.OS === 'ios' ? 48 : spacing.md,
  },
  heroTitle: {
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroPeriod: {
    marginTop: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    padding: spacing.lg,
  },
  coreInfoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: -40, // 负边距，让卡片与图片重叠
    marginHorizontal: spacing.sm,
    ...shadows.md,
  },
  coreInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coreInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.gray[200],
  },
  actionButtonsContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  actionTitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  primaryActionButton: {
    marginBottom: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary[500],
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  detailsCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsContent: {
    marginTop: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    marginHorizontal: spacing.xl,
  },
  quickActionText: {
    marginTop: spacing.xs,
  },
});