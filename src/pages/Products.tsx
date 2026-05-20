import { useMemo, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import { EmptyState } from '../components/common/EmptyState'
import { PageHeader } from '../components/common/PageHeader'
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Catalog"
        title="Product catalog"
        description="Filter a realistic premium electronics assortment across phones, tablets, wearables, audio, laptops, gaming, accessories, and smart-home devices."
      />
      <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_240px_220px]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands, categories"
            className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />
        </label>
        <label className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as ProductCategory | 'All')}
            className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          >
            <option value="All">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
        >
          <option value="featured">Featured</option>
          <option value="rating">Top rated</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>
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
