import { router } from 'expo-router';
import { Trash } from 'iconsax-react-nativejs';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { Button, Spinner, Text, XStack, YStack } from 'tamagui';
import type { Receipt } from '@/types/receipt';
import { storage } from '@/utils/storage';

export default function HomeScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReceipts = async () => {
    try {
      console.log('Loading receipts...');
      const receiptFiles = await storage.getReceipts();
      console.log('Receipts loaded:', receiptFiles.length);
      setReceipts(receiptFiles);
    } catch (error) {
      console.error('Error loading receipts:', error);
      Alert.alert('Error', 'Failed to load receipts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  const handleDelete = (receipt: Receipt) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.deleteReceipt(receipt.uri);
              loadReceipts();
            } catch (error) {
              console.error('Error deleting receipt:', error);
              Alert.alert('Error', 'Failed to delete receipt');
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadReceipts();
  };

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (receipts.length === 0) {
    return (
      <YStack f={1} jc="center" ai="center" gap="$4" px="$6" bg="$background">
        <Text fontSize={24} fontWeight="600" textAlign="center">
          No Receipts Yet
        </Text>
        <Text fontSize={14} color="$gray10" textAlign="center">
          Tap the scan button to capture your first receipt
        </Text>
        <Button
          size="$4"
          bg="#0a7ea4"
          pressStyle={{ opacity: 0.8 }}
          onPress={() => router.push('/scanner')}
        >
          <Text color="white">Scan Receipt</Text>
        </Button>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background">
      <XStack
        jc="space-between"
        ai="center"
        px="$4"
        pt="$4"
        pb="$2"
        bg="$background"
      >
        <Text fontSize={24} fontWeight="600">
          Receipts
        </Text>
        <Text fontSize={14} color="$gray10">
          {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'}
        </Text>
      </XStack>

      <FlatList
        data={receipts}
        keyExtractor={(item) => item.uri}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <Pressable
            style={styles.receiptCard}
            onLongPress={() => handleDelete(item)}
          >
            <Image source={{ uri: item.uri }} style={styles.receiptImage} />
            <XStack
              jc="space-between"
              ai="center"
              p="$2"
              bg="white"
              borderBottomLeftRadius="$4"
              borderBottomRightRadius="$4"
            >
              <Text fontSize={12} color="$gray10" numberOfLines={1} f={1}>
                {item.name}
              </Text>
              <Pressable
                onPress={() => handleDelete(item)}
                style={styles.deleteButton}
              >
                <Trash size={16} color="#ef4444" />
              </Pressable>
            </XStack>
          </Pressable>
        )}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
  },
  receiptCard: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: '50%',
  },
  receiptImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  deleteButton: {
    padding: 4,
  },
});
