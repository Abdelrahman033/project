import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.neutral[100] },
      }}
    >
      <Stack.Screen name="edit" />
    </Stack>
  );
} 