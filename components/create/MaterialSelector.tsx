import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Camera, Upload, Image as ImageIcon, History } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface MaterialSelectorProps {
  onSelectMaterial: (material: {
    type: 'image' | 'video';
    uri: string;
    source: 'camera' | 'gallery' | 'collection';
    id?: string;
  }) => void;
  collectionItems?: {
    id: string;
    thumbnailUri: string;
    type: 'image' | 'video';
    title: string;
  }[];
}

export default function MaterialSelector({ onSelectMaterial, collectionItems = [] }: MaterialSelectorProps) {
  const [selectedTab, setSelectedTab] = useState<'upload' | 'collection'>('upload');

  // 处理相机拍照
  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('需要相机权限才能拍摄照片');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      onSelectMaterial({
        type: asset.type || 'image',
        uri: asset.uri,
        source: 'camera'
      });
    }
  };
  
  // 处理从相册选择
  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('需要相册访问权限才能选择媒体文件');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      onSelectMaterial({
        type: asset.type || 'image',
        uri: asset.uri,
        source: 'gallery'
      });
    }
  };
  
  // 处理从收藏中选择
  const handleCollectionItemPress = (item: any) => {
    onSelectMaterial({
      type: item.type,
      uri: item.thumbnailUri,
      source: 'collection',
      id: item.id
    });
  };

  return (
    <View style={styles.container}>
      {/* 标签切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'upload' && styles.activeTab]}
          onPress={() => setSelectedTab('upload')}
        >
          <Upload size={16} color={selectedTab === 'upload' ? colors.primary[500] : colors.gray[500]} />
          <Text 
            variant="body2" 
            weight={selectedTab === 'upload' ? 'bold' : 'regular'}
            color={selectedTab === 'upload' ? colors.primary[500] : colors.gray[500]}
            style={styles.tabText}
          >
            上传素材
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'collection' && styles.activeTab]}
          onPress={() => setSelectedTab('collection')}
        >
          <History size={16} color={selectedTab === 'collection' ? colors.primary[500] : colors.gray[500]} />
          <Text 
            variant="body2" 
            weight={selectedTab === 'collection' ? 'bold' : 'regular'}
            color={selectedTab === 'collection' ? colors.primary[500] : colors.gray[500]}
            style={styles.tabText}
          >
            我的收藏
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 上传素材选项 */}
      {selectedTab === 'upload' && (
        <View style={styles.uploadOptions}>
          <TouchableOpacity 
            style={styles.uploadOption} 
            onPress={handleCameraPress}
          >
            <View style={styles.uploadIconContainer}>
              <Camera size={24} color={colors.primary[500]} />
            </View>
            <Text variant="body2" weight="bold">拍照/录像</Text>
            <Text variant="caption" color={colors.gray[500]}>使用相机拍摄新素材</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.uploadOption} 
            onPress={handleGalleryPress}
          >
            <View style={styles.uploadIconContainer}>
              <ImageIcon size={24} color={colors.primary[500]} />
            </View>
            <Text variant="body2" weight="bold">选择相册</Text>
            <Text variant="caption" color={colors.gray[500]}>从手机相册选择素材</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* 收藏素材列表 */}
      {selectedTab === 'collection' && (
        <ScrollView style={styles.collectionContainer}>
          {collectionItems.length > 0 ? (
            <View style={styles.collectionGrid}>
              {collectionItems.map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.collectionItem}
                  onPress={() => handleCollectionItemPress(item)}
                >
                  <Image 
                    source={{ uri: item.thumbnailUri }} 
                    style={styles.collectionThumbnail}
                  />
                  <Text 
                    variant="caption" 
                    numberOfLines={1} 
                    style={styles.collectionTitle}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCollection}>
              <Text align="center" color={colors.gray[500]}>
                暂无收藏素材
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[500],
  },
  tabText: {
    marginLeft: spacing.xs,
  },
  uploadOptions: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  uploadOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    margin: spacing.xs,
  },
  uploadIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  collectionContainer: {
    padding: spacing.md,
    maxHeight: 300,
  },
  collectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  collectionItem: {
    width: '30%',
    marginBottom: spacing.md,
    marginHorizontal: '1.66%',
  },
  collectionThumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.sm,
  },
  collectionTitle: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emptyCollection: {
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 