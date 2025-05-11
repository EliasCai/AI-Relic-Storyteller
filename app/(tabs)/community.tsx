import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  StatusBar,
  SafeAreaView 
} from 'react-native';
import { Heart, Clock, Siren as Fire } from 'lucide-react-native';

import ContentCard from '@/components/community/ContentCard';
import Text from '@/components/ui/Text';
import { colors, spacing } from '@/constants/theme';

// Placeholder data
const posts = [
  {
    id: '1',
    title: '秦始皇兵马俑：沉睡千年的军团',
    author: {
      name: '历史探索者',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    imageUrl: 'https://images.pexels.com/photos/16472058/pexels-photo-16472058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: 1256,
    comments: 89,
  },
  {
    id: '2',
    title: '故宫珍宝：紫禁城的奢华与辉煌',
    author: {
      name: '文化记录者',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    imageUrl: 'https://images.pexels.com/photos/2846029/pexels-photo-2846029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 854,
    comments: 56,
  },
  {
    id: '3',
    title: '敦煌莫高窟：丝路艺术的瑰宝',
    author: {
      name: '艺术史研究',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    imageUrl: 'https://images.pexels.com/photos/7887134/pexels-photo-7887134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 762,
    comments: 45,
  },
  {
    id: '4',
    title: '青铜器的铸造工艺：探索古代冶金技术',
    author: {
      name: '工艺研究员',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    imageUrl: 'https://images.pexels.com/photos/671555/pexels-photo-671555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 543,
    comments: 38,
  },
];

type TabType = 'recommended' | 'latest' | 'following';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('recommended');
  
  const renderTabButton = (tab: TabType, label: string, icon: React.ReactNode) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tab)}
    >
      {icon}
      <Text
        variant="body2"
        weight={activeTab === tab ? 'medium' : 'regular'}
        color={activeTab === tab ? colors.primary[500] : colors.gray[600]}
        style={styles.tabLabel}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const renderItem = ({ item }: { item: (typeof posts)[0] }) => (
    <ContentCard
      title={item.title}
      author={item.author}
      imageUrl={item.imageUrl}
      likes={item.likes}
      comments={item.comments}
      onPress={() => console.log('Content pressed:', item.id)}
      onLikePress={() => console.log('Like pressed:', item.id)}
      onCommentPress={() => console.log('Comment pressed:', item.id)}
      onSharePress={() => console.log('Share pressed:', item.id)}
    />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <Text variant="h3" weight="bold">
          社区
        </Text>
      </View>
      
      <View style={styles.tabBar}>
        {renderTabButton(
          'recommended',
          '推荐',
          <Fire 
            size={18} 
            color={activeTab === 'recommended' ? colors.primary[500] : colors.gray[600]} 
          />
        )}
        {renderTabButton(
          'latest',
          '最新',
          <Clock 
            size={18} 
            color={activeTab === 'latest' ? colors.primary[500] : colors.gray[600]} 
          />
        )}
        {renderTabButton(
          'following',
          '关注',
          <Heart 
            size={18} 
            color={activeTab === 'following' ? colors.primary[500] : colors.gray[600]} 
          />
        )}
      </View>
      
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[500],
  },
  tabLabel: {
    marginLeft: spacing.xs,
  },
  list: {
    paddingVertical: spacing.md,
  },
});