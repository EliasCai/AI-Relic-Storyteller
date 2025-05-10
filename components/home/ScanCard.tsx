import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Card from '@/components/ui/Card';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, borderRadius } from '@/constants/theme';

interface ScanCardProps {
  onScanPress: () => void;
}

export default function ScanCard({ onScanPress }: ScanCardProps) {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 375; // 针对小屏幕设备的判断
  
  return (
    <Card style={styles.card} shadowLevel="lg" roundedLevel="lg">
      <Image
        source={{ uri: 'https://images.pexels.com/photos/36006/renaissance-schallaburg-figures-frame.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
        style={[styles.backgroundImage, { borderRadius: borderRadius.lg }]}
      />
      
      <LinearGradient
        colors={['rgba(220, 38, 38, 0.8)', 'rgba(185, 28, 28, 0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: borderRadius.lg }]}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text 
            variant={isSmallScreen ? "h4" : "h3"} 
            weight="bold" 
            color={colors.white}
          >
            探索文物背后的故事
          </Text>
          <Text 
            variant="body1" 
            color={colors.white} 
            style={styles.subtitle}
          >
            扫描文物，发现历史
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.cameraButton,
            isSmallScreen && styles.cameraButtonSmall
          ]} 
          onPress={onScanPress}
        >
          <View style={[
            styles.cameraIconContainer,
            isSmallScreen && styles.cameraIconContainerSmall
          ]}>
            <Camera 
              size={isSmallScreen ? 22 : 28} 
              color={colors.secondary[600]} 
              strokeWidth={2.5} 
            />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonWrapper}>
        <Button 
          title="开始扫描" 
          size={isSmallScreen ? "md" : "lg"}
          fullWidth
          variant="outline"
          onPress={onScanPress}
          containerStyle={styles.scanButton}
          textStyle={{ color: colors.white }}
          icon={<Camera size={isSmallScreen ? 16 : 18} color={colors.white} />}
          activeOpacity={0.7}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    height: 180,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    height: 120,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  cameraButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonSmall: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  cameraIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainerSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  scanButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: colors.white,
    zIndex: 10, // 确保按钮在最上层
    elevation: 5, // Android上的层级
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});