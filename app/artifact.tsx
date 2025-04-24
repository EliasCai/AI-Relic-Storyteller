import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Dimensions 
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
  image: 'https://images.pexels.com/photos/14918486/pexels-photo-14918486.jpeg',
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: artifactData.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={styles.imageGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color={colors.white} size={24} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h2" weight="bold" style={styles.title}>
              {artifactData.name}
            </Text>
            <Text variant="body1" color={colors.gray[600]} style={styles.period}>
              {artifactData.dynasty} · {artifactData.period}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="看TA讲故事"
              size="lg"
              icon={<Video size={20} color={colors.white} />}
              containerStyle={styles.primaryButton}
              onPress={() => {
                console.log('查看AI科普视频');
                router.push('/aigcVideo');
              }}
            />
            
            <View style={styles.secondaryButtons}>
              <Button
                title="与TA对话"
                variant="outline"
                icon={<MessageSquare size={20} color={colors.primary[500]} />}
                containerStyle={[styles.secondaryButton, { marginRight: spacing.sm }]}
                onPress={() => {
                  console.log('与文物对话');
                  // 在实际应用中，这里会跳转到与文物的第一人称聊天界面
                }}
              />
              <Button
                title="基础信息卡"
                variant="outline"
                icon={<Info size={20} color={colors.primary[500]} />}
                containerStyle={styles.secondaryButton}
                onPress={() => setShowDetails(!showDetails)}
              />
            </View>
            
            <View style={styles.additionalButtons}>
              <Button
                title="创作我的作品"
                variant="ghost"
                icon={<Share2 size={20} color={colors.gray[600]} />}
                containerStyle={styles.additionalButton}
                onPress={() => {
                  console.log('开始创作');
                  // 在实际应用中，这里会跳转到创作流程
                }}
              />
              <Button
                title="加入收藏"
                variant="ghost"
                icon={<Heart size={20} color={isLiked ? colors.red[500] : colors.gray[600]} />}
                containerStyle={styles.additionalButton}
                onPress={() => setIsLiked(!isLiked)}
              />
            </View>
          </View>

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

          <TouchableOpacity
            style={styles.detailsCard}
            onPress={() => setShowDetails(!showDetails)}
          >
            <View style={styles.detailsHeader}>
              <Text variant="h4" weight="bold">
                文物信息
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
                    材质
                  </Text>
                  <Text variant="body2">{artifactData.details.material}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text variant="body2" color={colors.gray[500]}>
                    尺寸
                  </Text>
                  <Text variant="body2">{artifactData.details.size}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text variant="body2" color={colors.gray[500]}>
                    出土地点
                  </Text>
                  <Text variant="body2">{artifactData.details.location}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text variant="body2" color={colors.gray[500]}>
                    收藏单位
                  </Text>
                  <Text variant="body2">{artifactData.details.collection}</Text>
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
    height: width * 0.8,
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
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  period: {
    marginBottom: spacing.md,
  },
  actionButtons: {
    marginBottom: spacing.xl,
  },
  primaryButton: {
    marginBottom: spacing.md,
  },
  secondaryButtons: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  secondaryButton: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    marginRight: spacing.xl,
  },
  quickActionText: {
    marginTop: spacing.xs,
  },
  detailsCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.md,
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
});