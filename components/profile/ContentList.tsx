import React from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius } from '@/constants/theme';

export interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  views: number;
  likes: number;
  createdAt: string;
}

interface ContentListProps {
  data: ContentItem[];
  onItemPress: (item: ContentItem) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function ContentList({ data, onItemPress }: ContentListProps) {
  const renderItem = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      activeOpacity={0.9}
      onPress={() => onItemPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </View>
      
      <Text 
        variant="body2" 
        weight="medium" 
        numberOfLines={2}
        style={styles.title}
      >
        {item.title}
      </Text>
      
      <View style={styles.statsRow}>
        <Text variant="caption" color={colors.gray[500]}>
          {item.views} 次观看
        </Text>
        <Text variant="caption" color={colors.gray[500]}>
          {item.likes} 赞
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: ITEM_WIDTH * 0.75,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    padding: spacing.sm,
    paddingBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
});