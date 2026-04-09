import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AppTheme } from '@/constants/app-theme';

type Props = {
  rows?: number;
};

export function LoadingSkeleton({ rows = 3 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: rows }).map((_, idx) => (
        <Animated.View
          key={idx}
          entering={FadeIn.delay(idx * 40).duration(350)}
          exiting={FadeOut.duration(220)}
          style={styles.row}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    height: 96,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.peachSoft,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
});
