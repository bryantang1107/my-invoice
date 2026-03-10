import { Tabs } from 'expo-router';
import { Home, Receipt1, Scanner } from 'iconsax-react-nativejs';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text, YStack } from 'tamagui';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#0a7ea4',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5ea',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <YStack jc="center" ai="center" gap={4}>
              <Text
                fontSize={12}
                fontWeight={focused ? '600' : '400'}
                color={color}
              >
                Home
              </Text>
              <Home size={26} color={color} />
            </YStack>
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.scannerButton}>
              <View
                style={[
                  styles.scannerInner,
                  focused && styles.scannerInnerActive,
                ]}
              >
                <Scanner size={32} color="#fff" />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="receipt"
        options={{
          title: 'Receipts',
          tabBarIcon: ({ color, focused }) => (
            <YStack jc="center" ai="center" gap={4}>
              <Text
                fontSize={12}
                fontWeight={focused ? '600' : '400'}
                color={color}
              >
                Receipts
              </Text>
              <Receipt1 size={26} color={color} />
            </YStack>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scannerButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  scannerInnerActive: {
    backgroundColor: '#0d5d73',
    transform: [{ scale: 0.95 }],
  },
});
