import type { Receipt } from '@/types/receipt';
import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const STORAGE_KEY = 'receipts_storage';

// Web storage using localStorage
const webStorage = {
  async saveReceipt(dataUri: string): Promise<Receipt> {
    const timestamp = new Date().getTime();
    const name = `receipt_${timestamp}.jpg`;

    const receipts = await this.getReceipts();
    const newReceipt: Receipt = {
      uri: dataUri,
      name,
      timestamp,
    };

    receipts.push(newReceipt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));

    return newReceipt;
  },

  async getReceipts(): Promise<Receipt[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  async deleteReceipt(uri: string): Promise<void> {
    const receipts = await this.getReceipts();
    const filtered = receipts.filter((r) => r.uri !== uri);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};

// Native storage using expo-file-system
const nativeStorage = {
  async saveReceipt(photoUri: string): Promise<Receipt> {
    const receiptsDir = new Directory(Paths.cache, 'receipts');

    if (!receiptsDir.exists) {
      receiptsDir.create({ idempotent: true });
    }

    const timestamp = new Date().getTime();
    const filename = `receipt_${timestamp}.jpg`;
    const destination = new File(receiptsDir, filename);

    const sourceFile = new File(photoUri);
    sourceFile.copy(destination);

    return {
      uri: destination.uri,
      name: filename,
      timestamp,
    };
  },

  async getReceipts(): Promise<Receipt[]> {
    const receiptsDir = new Directory(Paths.cache, 'receipts');

    if (!receiptsDir.exists) {
      return [];
    }

    const files = receiptsDir.list();
    return files
      .filter((item): item is File => item instanceof File)
      .map((file) => ({
        uri: file.uri,
        name: file.name,
        timestamp: file.modificationTime || 0,
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  async deleteReceipt(uri: string): Promise<void> {
    const file = new File(uri);
    file.delete();
  },
};

export const storage = Platform.OS === 'web' ? webStorage : nativeStorage;
