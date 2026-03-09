import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Camera, Flash, Gallery } from 'iconsax-react-nativejs';
import { useRef, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Button, Spinner, Text, XStack, YStack } from 'tamagui';
import { storage } from '@/utils/storage';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission?.granted) {
    return (
      <YStack f={1} jc="center" ai="center" gap="$4" px="$6" bg="$background">
        <Camera size={64} color="#0a7ea4" />
        <Text fontSize={20} fontWeight="600" textAlign="center">
          Camera Permission Required
        </Text>
        <Text fontSize={14} color="$gray10" textAlign="center">
          We need camera access to scan your receipts and documents
        </Text>
        <Button
          size="$4"
          bg="#0a7ea4"
          pressStyle={{ opacity: 0.8 }}
          onPress={async () => {
            console.log('Requesting permission...');
            const result = await requestPermission();
            console.log('Permission result:', result);
            if (!result.granted) {
              Alert.alert(
                'Permission Denied',
                'Camera access is required to scan receipts. Please enable it in your device settings.',
              );
            }
          }}
        >
          <Text color="white">Grant Permission</Text>
        </Button>
      </YStack>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || capturing) return;

    try {
      setCapturing(true);

      // Take the photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        Alert.alert('Error', 'Failed to capture image');
        return;
      }

      console.log('Photo captured:', photo.uri);

      try {
        // Save the receipt using platform-specific storage
        const receipt = await storage.saveReceipt(photo.uri);
        console.log('Receipt saved:', receipt);

        Alert.alert(
          'Success',
          'Receipt saved successfully!',
          [
            {
              text: 'Take Another',
              style: 'cancel',
            },
            {
              text: 'View Gallery',
              onPress: () => {
                router.push('/');
              },
            },
          ],
          { cancelable: false }
        );
      } catch (fileError) {
        console.error('File operation error:', fileError);
        Alert.alert('Error', `Failed to save file: ${fileError}`);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <YStack f={1} bg="black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        flash={flash}
      >
        {/* Top bar with flash toggle */}
        <XStack
          jc="space-between"
          ai="center"
          px="$4"
          pt={Platform.OS === 'ios' ? '$12' : '$4'}
          pb="$4"
          bg="rgba(0,0,0,0.5)"
        >
          <Text color="white" fontSize={18} fontWeight="600">
            Scan Document
          </Text>
          <Pressable
            onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
            style={styles.flashButton}
          >
            <Flash size={24} color={flash === 'on' ? '#FFD700' : '#fff'} />
          </Pressable>
        </XStack>

        {/* Camera guide overlay */}
        <View style={styles.overlay}>
          <View style={styles.guideBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text
            style={styles.guideText}
            color="white"
            fontSize={14}
            textAlign="center"
          >
            Position document within frame
          </Text>
        </View>

        {/* Bottom controls */}
        <XStack
          pos="absolute"
          bottom={Platform.OS === 'ios' ? '$12' : '$8'}
          w="100%"
          jc="center"
          ai="center"
          gap="$8"
        >
          {/* Gallery button (placeholder) */}
          <Pressable style={styles.sideButton}>
            <Gallery size={32} color="white" />
          </Pressable>

          {/* Capture button */}
          <Pressable
            onPress={takePicture}
            disabled={capturing}
            style={styles.captureButton}
          >
            {capturing ? (
              <Spinner color="white" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </Pressable>

          {/* Spacer for symmetry */}
          <View style={styles.sideButton} />
        </XStack>
      </CameraView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  guideBox: {
    width: '90%',
    aspectRatio: 3 / 4,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'white',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  guideText: {
    marginTop: 32,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  sideButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
