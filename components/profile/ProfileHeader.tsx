import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Settings, CreditCard as Edit2 } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius } from '@/constants/theme';

interface ProfileHeaderProps {
  name: string;
  avatar: string;
  points: number;
  creationCount: number;
  onSettingsPress: () => void;
  onEditPress: () => void;
}

export default function ProfileHeader({
  name,
  avatar,
  points,
  creationCount,
  onSettingsPress,
  onEditPress,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
            <Edit2 size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text variant="h3" weight="bold">
              {name}
            </Text>
            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={onSettingsPress}
            >
              <Settings size={20} color={colors.gray[700]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="h4" weight="bold" color={colors.primary[600]}>
                {points}
              </Text>
              <Text variant="caption" color={colors.gray[600]}>
                积分
              </Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.statItem}>
              <Text variant="h4" weight="bold" color={colors.primary[600]}>
                {creationCount}
              </Text>
              <Text variant="caption" color={colors.gray[600]}>
                创作
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary[100],
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[500],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: colors.gray[300],
    marginHorizontal: spacing.sm,
  },
});