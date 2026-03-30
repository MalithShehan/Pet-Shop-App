import { useEffect, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { CategoryFilter } from '@/components/category-filter';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import { AppTheme } from '@/constants/app-theme';
import {
  categoryOptionToValue,
  categoryOptions,
  products,
  subCategoryByCategory,
  subCategoryLabelMap,
  subCategoryLabelToValue,
} from '@/data/pets';
import { useLoadingDelay } from '@/hooks/useLoadingDelay';

const priceRangeOptions = ['All Prices', 'Under $20', '$20 - $100', 'Over $100'] as const;
type PriceRangeOption = (typeof priceRangeOptions)[number];

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categoryOptions)[number]>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All Types');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeOption>('All Prices');
  const [query, setQuery] = useState('');
  const loading = useLoadingDelay(450);

  useEffect(() => {
    setSelectedSubCategory('All Types');
  }, [selectedCategory]);

  const subCategoryOptions = useMemo(
    () => subCategoryByCategory[selectedCategory],
    [selectedCategory]
  );

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    const categoryValue = categoryOptionToValue[selectedCategory];
    const subCategoryValue = subCategoryLabelToValue[selectedSubCategory];

    return products.filter((item) => {
      const categoryMatch = categoryValue === 'all' || item.category === categoryValue;
      const subCategoryMatch =
        subCategoryValue === 'all' || item.subCategory === subCategoryValue;
      const searchMatch =
        search.length === 0 ||
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        subCategoryLabelMap[item.subCategory].toLowerCase().includes(search);

      let priceMatch = true;
      if (selectedPriceRange === 'Under $20') {
        priceMatch = item.price < 20;
      } else if (selectedPriceRange === '$20 - $100') {
        priceMatch = item.price >= 20 && item.price <= 100;
      } else if (selectedPriceRange === 'Over $100') {
        priceMatch = item.price > 100;
      }

      return categoryMatch && subCategoryMatch && searchMatch && priceMatch;
    });
  }, [query, selectedCategory, selectedSubCategory, selectedPriceRange]);

  return (
    <PageShell>
      <Animated.View entering={FadeIn.duration(350)} style={styles.headerWrap}>
        <LinearGradient colors={['#FFFFFFED', '#FFFFFFCD']} style={styles.header}>
          <Text style={styles.title}>Shop Pet Essentials</Text>
          <Text style={styles.subTitle}>Browse pets, foods, and accessories in one place.</Text>
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Pets</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Foods</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Accessories</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <SearchBar value={query} onChangeText={setQuery} placeholder="Search products, food, accessories" />

      <CategoryFilter
        categories={categoryOptions}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        icons={{
          All: 'grid-outline',
          Pets: 'paw-outline',
          Foods: 'restaurant-outline',
          Accessories: 'gift-outline',
        }}
      />

      <CategoryFilter
        categories={subCategoryOptions}
        selected={selectedSubCategory}
        onSelect={setSelectedSubCategory}
      />

      <CategoryFilter
        categories={priceRangeOptions}
        selected={selectedPriceRange}
        onSelect={setSelectedPriceRange}
        icons={{
          'All Prices': 'pricetags-outline',
          'Under $20': 'cash-outline',
          '$20 - $100': 'wallet-outline',
          'Over $100': 'diamond-outline',
        }}
      />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySub}>Try another keyword or filter combination.</Text>
        </View>
      ) : (
        filteredProducts.map((item, index) => <ProductCard key={item.id} item={item} index={index} />)
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
    gap: 6,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: AppTheme.colors.text,
  },
  subTitle: {
    color: AppTheme.colors.textSoft,
    lineHeight: 19,
  },
  pillRow: {
    marginTop: 2,
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: '#FFFFFFC9',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    color: AppTheme.colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
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
