import { useEffect, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { CategoryFilter } from '@/components/category-filter';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';
import {
  categoryOptionToValue,
  categoryOptions,
  ProductItem,
  subCategoryByCategory,
  subCategoryLabelToValue,
} from '@/data/pets';
import { fetchProducts } from '@/services/product-api';

const priceRangeOptions = ['All Prices', 'Under Rs.1000', 'Rs.1000 - Rs.5000', 'Over Rs.5000'] as const;
type PriceRangeOption = (typeof priceRangeOptions)[number];

export default function ShopScreen() {
  const { width, height } = useWindowDimensions();
  const { isTablet, isCompact, isLandscape } = getDeviceClass(width, height);
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
      category?: string;
      subCategory?: string;
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

    if (selectedPriceRange === 'Under Rs.1000') {
      params.maxPrice = 1000;
    } else if (selectedPriceRange === 'Rs.1000 - Rs.5000') {
      params.minPrice = 1000;
      params.maxPrice = 5000;
    } else if (selectedPriceRange === 'Over Rs.5000') {
      params.minPrice = 5000;
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
        <LinearGradient colors={[AppTheme.colors.peachSoft, AppTheme.colors.peachLight + 'CD']} style={styles.header}>
          <Text style={[styles.title, isTablet && styles.titleTablet, (isCompact || isLandscape) && styles.titleCompact]}>
            Shop Pet Essentials
          </Text>
          <Text style={styles.subTitle}>Browse pets, foods, and accessories in one place.</Text>
          <View style={[styles.pillRow, (isCompact || isLandscape) && styles.pillRowCompact]}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Food</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Toys</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Accessories</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Health</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Grooming</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <SearchBar value={query} onChangeText={setQuery} placeholder="Search products, food, accessories" />

      <View style={styles.filterBlock}>
        <Text style={styles.filterLabel}>Category</Text>
        <CategoryFilter
          categories={categoryOptions}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          icons={{
            All: 'grid-outline',
            Food: 'restaurant-outline',
            Toys: 'game-controller-outline',
            Accessories: 'gift-outline',
            Health: 'medkit-outline',
            Grooming: 'cut-outline',
          }}
        />
      </View>

      <View style={styles.filterBlock}>
        <Text style={styles.filterLabel}>Type</Text>
        <CategoryFilter
          categories={subCategoryOptions}
          selected={selectedSubCategory}
          onSelect={setSelectedSubCategory}
        />
      </View>

      <View style={styles.filterBlock}>
        <Text style={styles.filterLabel}>Price Range</Text>
        <CategoryFilter
          categories={priceRangeOptions}
          selected={selectedPriceRange}
          onSelect={setSelectedPriceRange}
          icons={{
            'All Prices': 'pricetags-outline',
            'Under Rs.1000': 'cash-outline',
            'Rs.1000 - Rs.5000': 'wallet-outline',
            'Over Rs.5000': 'diamond-outline',
          }}
        />
      </View>

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
    gap: 7,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.peach,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: AppTheme.colors.text,
  },
  titleTablet: {
    fontSize: 34,
  },
  titleCompact: {
    fontSize: 24,
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
  pillRowCompact: {
    flexWrap: 'wrap',
  },
  pill: {
    borderRadius: AppTheme.radius.full,
    borderWidth: 1,
    borderColor: AppTheme.colors.primaryLight,
    backgroundColor: AppTheme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    color: AppTheme.colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  filterBlock: {
    gap: 4,
  },
  filterLabel: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  emptyWrap: {
    borderWidth: 1,
    borderColor: AppTheme.colors.borderStrong,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surfaceElevated,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    ...AppTheme.shadow.soft,
  },
  emptyTitle: {
    color: AppTheme.colors.text,
    fontWeight: '800',
  },
  emptySub: {
    color: AppTheme.colors.textSoft,
  },
});
