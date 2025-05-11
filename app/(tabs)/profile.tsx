import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  StatusBar,
  SafeAreaView 
} from 'react-native';

import ProfileHeader from '@/components/profile/ProfileHeader';
import PointsCard from '@/components/profile/PointsCard';
import ContentList, { ContentItem } from '@/components/profile/ContentList';
import Text from '@/components/ui/Text';
import { colors, spacing } from '@/constants/theme';

// Sample data
const userContent: ContentItem[] = [
  {
    id: '1',
    title: '秦始皇兵马俑：沉睡千年的军团',
    imageUrl: 'https://images.pexels.com/photos/16472058/pexels-photo-16472058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    views: 1256,
    likes: 342,
    createdAt: '2023-04-15',
  },
  {
    id: '2',
    title: '故宫珍宝：紫禁城的奢华与辉煌',
    imageUrl: 'https://images.pexels.com/photos/2846029/pexels-photo-2846029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    views: 854,
    likes: 201,
    createdAt: '2023-03-28',
  },
  {
    id: '3',
    title: '敦煌莫高窟：丝路艺术的瑰宝',
    imageUrl: 'https://images.pexels.com/photos/7887134/pexels-photo-7887134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    views: 762,
    likes: 178,
    createdAt: '2023-03-12',
  },
  {
    id: '4',
    title: '青铜器的铸造工艺',
    imageUrl: 'https://images.pexels.com/photos/671555/pexels-photo-671555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    views: 543,
    likes: 129,
    createdAt: '2023-02-25',
  },
];

type TabType = 'creations' | 'collections' | 'likes';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('creations');
  
  const renderTabButton = (tab: TabType, label: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        variant="body1"
        weight={activeTab === tab ? 'medium' : 'regular'}
        color={activeTab === tab ? colors.primary[500] : colors.gray[600]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <ProfileHeader
          name="文博爱好者"
          avatar="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          points={2580}
          creationCount={12}
          onSettingsPress={() => console.log('Settings')}
          onEditPress={() => console.log('Edit profile')}
        />
        
        <PointsCard
          points={2580}
          level={3}
          onPress={() => console.log('Open points center')}
        />
      </View>
      
      <View style={styles.tabBar}>
        {renderTabButton('creations', '我的创作')}
        {renderTabButton('collections', '收藏')}
        {renderTabButton('likes', '赞过')}
      </View>
      
      {activeTab === 'creations' && (
        <ContentList
          data={userContent}
          onItemPress={(item) => console.log('Content pressed:', item.id)}
        />
      )}
      
      {activeTab === 'collections' && (
        <View style={styles.emptyState}>
          <Text 
            variant="body1" 
            align="center" 
            color={colors.gray[500]}
          >
            暂无收藏内容
          </Text>
        </View>
      )}
      
      {activeTab === 'likes' && (
        <View style={styles.emptyState}>
          <Text 
            variant="body1" 
            align="center" 
            color={colors.gray[500]}
          >
            暂无点赞内容
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    backgroundColor: colors.white,
    paddingBottom: spacing.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[500],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
});