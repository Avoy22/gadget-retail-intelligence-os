import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { PageHeader } from '../components/common/PageHeader'
import { SearchInput } from '../components/common/SearchInput'
import { SectionHeader } from '../components/common/SectionHeader'
import { Select } from '../components/common/FormControls'
import { ProductCard } from '../components/products/ProductCard'
import { useAppData } from '../context/AppDataContext'
import { categories } from '../data/mockData'
import type { ProductCategory } from '../types'

export function Products() {
  const { activeProducts } = useAppData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'All'>('All')
  const [sort, setSort] = useState('featured')

  const filtered = useMemo(() => {
    const result = activeProducts.filter((product) => {
      const matchesQuery = `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || product.category === category
      return matchesQuery && matchesCategory
    })

    return [...result].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return b.reviews - a.reviews
    })
  }, [activeProducts, category, query, sort])

  const categoryCounts = categories.map((item) => ({
    category: item,
    count: activeProducts.filter((product) => product.category === item).length,
  }))

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Catalog"
        title="Product catalog"
        description="Filter a realistic premium electronics assortment across phones, tablets, wearables, audio, laptops, gaming, accessories, and smart-home devices."
      />
      <Card className="mb-6 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
          <SlidersHorizontal size={18} className="text-cyan-700" />
          Catalog controls
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_240px_220px]">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands, categories"
          />
          <Select value={category} onChange={(event) => setCategory(event.target.value as ProductCategory | 'All')}>
            <option value="All">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </Select>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory('All')}
            className={`min-w-max rounded-full border px-3 py-2 text-xs font-bold transition ${
              category === 'All' ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
            }`}
          >
            All products <span className="ml-1 opacity-70">{activeProducts.length}</span>
          </button>
          {categoryCounts.map((item) => (
            <button
              key={item.category}
              type="button"
              onClick={() => setCategory(item.category)}
              className={`min-w-max rounded-full border px-3 py-2 text-xs font-bold transition ${
                category === item.category ? 'border-cyan-700 bg-cyan-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
              }`}
            >
              {item.category} <span className="ml-1 opacity-70">{item.count}</span>
            </button>
          ))}
        </div>
      </Card>
      <SectionHeader
        title={`${filtered.length} products available`}
        description="Cards combine pricing, brand, tags, rating, availability, and product status for quick assisted-selling decisions."
        action={category !== 'All' ? <Badge tone="info">{category}</Badge> : undefined}
      />
      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" description="Try a different search term or category filter." />
      )}
    </section>
  )
}
