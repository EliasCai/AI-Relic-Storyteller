import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';

import ScanCard from '@/components/home/ScanCard';
import FeaturedCard from '@/components/home/FeaturedCard';
import RecommendedItem from '@/components/home/RecommendedItem';
import Text from '@/components/ui/Text';
import { colors, spacing } from '@/constants/theme';

// Placeholder data
const featured = [
  {
    id: '1',
    title: '秦始皇兵马俑：沉睡千年的军团',
    author: '历史探索者',
    imageUrl: 'https://images.pexels.com/photos/1850013/pexels-photo-1850013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 1256,
  },
  {
    id: '2',
    title: '故宫珍宝：紫禁城的奢华与辉煌',
    author: '文化记录者',
    imageUrl: 'https://images.pexels.com/photos/2846029/pexels-photo-2846029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 854,
  },
  {
    id: '3',
    title: '敦煌莫高窟：丝路艺术的瑰宝',
    author: '艺术史研究',
    imageUrl: 'https://images.pexels.com/photos/7887134/pexels-photo-7887134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 762,
  },
];

const recommended = [
  {
    id: '1',
    title: '青铜器的铸造工艺',
    subtitle: '探索古代冶金技术',
    imageUrl: 'https://images.pexels.com/photos/671555/pexels-photo-671555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    title: '唐三彩与丝路文化交流',
    subtitle: '陶瓷艺术的东西方融合',
    imageUrl: 'https://images.pexels.com/photos/1104365/pexels-photo-1104365.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    title: '明清家具的设计智慧',
    subtitle: '传统工艺与现代启示',
    imageUrl: 'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    title: '古代丝绸与服饰文化',
    subtitle: '从蚕丝到华服的演变',
    imageUrl: 'https://images.pexels.com/photos/10419719/pexels-photo-10419719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleScanPress = () => {
    // 跳转到扫描页面
    router.push('/scanner');
  };
  
  const renderFeaturedItem = ({ item }: { item: (typeof featured)[0] }) => (
    <FeaturedCard
      title={item.title}
      author={item.author}
      imageUrl={item.imageUrl}
      likes={item.likes}
      onPress={() => console.log('Featured pressed:', item.id)}
    />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <Text variant="h3" weight="bold">
          发现
        </Text>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.gray[400]} />
          <Text
            variant="body1"
            color={colors.gray[400]}
            style={styles.searchPlaceholder}
          >
            搜索文物、展览或创作
          </Text>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScanCard onScanPress={handleScanPress} />
        
        <View style={styles.sectionHeader}>
          <Text variant="h4" weight="bold">
            推荐创作
          </Text>
          <Text
            variant="body2"
            color={colors.primary[500]}
            onPress={() => router.push('/community')}
          >
            查看全部
          </Text>
        </View>
        
        <FlatList
          data={featured}
          renderItem={renderFeaturedItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
        
        <View style={styles.sectionHeader}>
          <Text variant="h4" weight="bold">
            热门讲解
          </Text>
        </View>
        
        {recommended.map((item) => (
          <RecommendedItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            imageUrl={item.imageUrl}
            onPress={() => console.log('Recommended pressed:', item.id)}
          />
        ))}
      </ScrollView>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginTop: spacing.sm,
  },
  searchPlaceholder: {
    marginLeft: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  featuredList: {
    paddingRight: spacing.md,
  },
});