import { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { CategoryFilter } from '@/components/category-filter';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import { AppTheme } from '@/constants/app-theme';
import { categories, pets } from '@/data/pets';
import { useLoadingDelay } from '@/hooks/useLoadingDelay';

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('All');
  const [query, setQuery] = useState('');
  const loading = useLoadingDelay(450);

  const filteredPets = useMemo(() => {
    const search = query.trim().toLowerCase();

    return pets.filter((item) => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const searchMatch =
        search.length === 0 ||
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search);
      return categoryMatch && searchMatch;
    });
  }, [query, selectedCategory]);

  return (
    <PageShell>
      <Animated.View entering={FadeIn.duration(350)} style={styles.headerWrap}>
        <LinearGradient colors={['#FFFFFFDF', '#FFFFFFBB']} style={styles.header}>
          <Text style={styles.title}>Shop Pets</Text>
          <Text style={styles.subTitle}>Find dogs, cats, and birds for your perfect home.</Text>
        </LinearGradient>
      </Animated.View>

      <SearchBar value={query} onChangeText={setQuery} placeholder="Search by name or category" />
      <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : filteredPets.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No pets found</Text>
          <Text style={styles.emptySub}>Try another keyword or category.</Text>
        </View>
      ) : (
        filteredPets.map((item, index) => <ProductCard key={item.id} item={item} index={index} />)
      )}
    </PageShell>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    borderRadius: AppTheme.radius.lg,
    ...AppTheme.shadow.card,
  },
  header: {
    gap: 4,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: AppTheme.colors.text,
  },
  subTitle: {
    color: AppTheme.colors.textSoft,
  },
  emptyWrap: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    ...AppTheme.shadow.card,
  },
  emptyTitle: {
    color: AppTheme.colors.text,
    fontWeight: '800',
  },
  emptySub: {
    color: AppTheme.colors.textSoft,
  },
});
