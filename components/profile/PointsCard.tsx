import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '@/components/ui/Card';
import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius } from '@/constants/theme';

interface PointsCardProps {
  points: number;
  level: number;
  onPress: () => void;
}

export default function PointsCard({ points, level, onPress }: PointsCardProps) {
  const progressPercentage = Math.min((points % 1000) / 1000 * 100, 100);
  
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={styles.card} shadowLevel="md" roundedLevel="lg">
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Award size={20} color={colors.accent[500]} />
            <Text 
              variant="h4" 
              weight="bold" 
              style={styles.title}
            >
              积分中心
            </Text>
          </View>
          
          <View style={styles.pointsContainer}>
            <Text variant="h3" weight="bold" color={colors.accent[600]}>
              {points}
            </Text>
            <Text variant="caption" color={colors.gray[600]}>
              我的积分
            </Text>
          </View>
        </View>
        
        <View style={styles.levelContainer}>
          <View style={styles.levelHeader}>
            <Text variant="body2" color={colors.gray[700]}>
              等级 {level}
            </Text>
            <Text variant="body2" color={colors.gray[700]}>
              距离下一级还需 {1000 - (points % 1000)} 积分
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <LinearGradient
              colors={[colors.accent[300], colors.accent[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBar,
                { width: `${progressPercentage}%` }
              ]}
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text variant="body2" color={colors.gray[700]}>
            查看积分详情和兑换奖励
          </Text>
          <ChevronRight size={18} color={colors.gray[500]} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: spacing.xs,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  levelContainer: {
    marginBottom: spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
});