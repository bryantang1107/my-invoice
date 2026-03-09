import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

export const tamaguiConfig = createTamagui(config);

export type MyTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends MyTamaguiConfig {}
}
