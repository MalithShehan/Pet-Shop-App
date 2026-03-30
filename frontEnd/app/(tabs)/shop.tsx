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
  ProductItem,
  subCategoryByCategory,
  subCategoryLabelToValue,
} from '@/data/pets';
import { fetchProducts } from '@/services/product-api';

const priceRangeOptions = ['All Prices', 'Under $20', '$20 - $100', 'Over $100'] as const;
type PriceRangeOption = (typeof priceRangeOptions)[number];

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categoryOptions)[number]>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All Types');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeOption>('All Prices');
  const [query, setQuery] = useState('');
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSubCategory('All Types');
  }, [selectedCategory]);

  const subCategoryOptions = useMemo(
    () => subCategoryByCategory[selectedCategory],
    [selectedCategory]
  );

  const filterParams = useMemo(() => {
    const categoryValue = categoryOptionToValue[selectedCategory];
    const subCategoryValue = subCategoryLabelToValue[selectedSubCategory];
    const params: {
      category?: 'pet' | 'food' | 'accessory';
      subCategory?:
        | 'dog'
        | 'cat'
        | 'bird'
        | 'dog-food'
        | 'cat-food'
        | 'bird-food'
        | 'toys'
        | 'cages'
        | 'leashes'
        | 'bowls';
      minPrice?: number;
      maxPrice?: number;
      q?: string;
      sort?: 'latest' | 'price_asc' | 'price_desc';
      limit?: number;
    } = {
      limit: 100,
      sort: 'latest',
    };

    if (categoryValue !== 'all') {
      params.category = categoryValue;
    }

    if (subCategoryValue !== 'all') {
      params.subCategory = subCategoryValue;
    }

    if (query.trim()) {
      params.q = query.trim();
    }

    if (selectedPriceRange === 'Under $20') {
      params.maxPrice = 20;
    } else if (selectedPriceRange === '$20 - $100') {
      params.minPrice = 20;
      params.maxPrice = 100;
    } else if (selectedPriceRange === 'Over $100') {
      params.minPrice = 100;
    }

    return params;
  }, [query, selectedCategory, selectedPriceRange, selectedSubCategory]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchProducts(filterParams);
        setProductItems(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load products');
        setProductItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filterParams]);

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
      ) : error ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Could not load products</Text>
          <Text style={styles.emptySub}>{error}</Text>
        </View>
      ) : productItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySub}>Try another keyword or filter combination.</Text>
        </View>
      ) : (
        productItems.map((item, index) => <ProductCard key={item.id} item={item} index={index} />)
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
