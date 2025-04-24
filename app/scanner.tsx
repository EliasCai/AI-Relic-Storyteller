import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Camera, FlashlightOff as FlashOff, Slash as FlashOn, Image as ImageIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.8;

export default function ScannerScreen() {
  // 将所有hooks移到组件顶部
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  
  // 自动扫描功能
  useEffect(() => {
    if (permission?.granted) {
      const autoScanInterval = setInterval(() => {
        // 实际图像分析逻辑
      }, 1000);
      
      return () => clearInterval(autoScanInterval);
    }
  }, [permission]);

  // 模拟扫描识别过程
  const startScanning = () => {
    setScanning(true);
    setScanProgress(0);
    
    // 模拟扫描进度
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 0.05;
        if (newProgress >= 1) {
          clearInterval(interval);
          // 扫描完成后跳转到文物详情页
          setTimeout(() => {
            setScanning(false);
            router.push({
              pathname: '/artifact',
              params: { identified: 'true' }
            });
          }, 500);
          return 1;
        }
        return newProgress;
      });
    }, 100);
  };
  
  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // 开始扫描识别过程
        startScanning();
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };
  
  const handleGalleryPress = async () => {
    try {
      // 导入ImagePicker (在实际应用中应该在文件顶部导入)
      const { launchImageLibraryAsync, MediaTypeOptions } = await import('expo-image-picker');
      
      // 请求权限
      const { status } = await import('expo-image-picker').then(lib => lib.requestMediaLibraryPermissionsAsync());
      
      if (status !== 'granted') {
        alert('需要相册访问权限才能选择文物图片');
        return;
      }
      
      // 打开相册选择图片
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // 选择了图片，开始扫描识别过程
        startScanning();
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
    }
  };

  // 根据权限状态渲染不同的UI
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text variant="h3" weight="bold" align="center" style={styles.permissionTitle}>
          需要相机权限
        </Text>
        <Text variant="body1" align="center" style={styles.permissionText}>
          我们需要相机权限来扫描和识别文物。请点击下方按钮授权访问。
        </Text>
        <Button
          title="授权相机权限"
          size="lg"
          onPress={requestPermission}
          containerStyle={styles.permissionButton}
        />
        <Button
          title="返回"
          variant="ghost"
          onPress={() => router.back()}
          containerStyle={styles.backButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        flashMode={flash ? 'on' : 'off'}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.topGradient}
        />
        
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Camera size={24} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFlash(!flash)}
            >
              {flash ? (
                <FlashOn size={24} color={colors.white} />
              ) : (
                <FlashOff size={24} color={colors.white} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.iconButton, { marginLeft: spacing.md }]}
              onPress={handleGalleryPress}
            >
              <ImageIcon size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.scanAreaContainer}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <View style={[styles.scanLine, scanning && { top: `${scanProgress * 100}%` }]} />
          </View>
          
          <Text
            variant="body1"
            color={colors.white}
            align="center"
            style={styles.guideText}
          >
            {scanning ? '正在识别中...' : '将文物放入取景框内，自动扫描识别'}
          </Text>
          
          {scanning && (
            <View style={styles.scanningOverlay}>
              <Text
                variant="h4"
                weight="bold"
                color={colors.white}
                align="center"
                style={styles.scanningText}
              >
                文物识别中
              </Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${scanProgress * 100}%` }]} />
              </View>
            </View>
          )}
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.bottomGradient}
        >
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            activeOpacity={0.8}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </LinearGradient>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  permissionTitle: {
    marginBottom: spacing.md,
  },
  permissionText: {
    marginBottom: spacing.xl,
    color: colors.gray[600],
    textAlign: 'center',
  },
  permissionButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  backButton: {
    width: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 48 : spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary[500],
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary[500],
    top: '50%',
    opacity: 0.8,
    transition: 'top 0.5s ease',
  },
  guideText: {
    marginTop: spacing.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  scanningText: {
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  progressContainer: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 48 : spacing.xl,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
  },
});