import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 5. Download 12 items from api get: products + Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=12"),
          fetch("https://api.escuelajs.co/api/v1/categories?limit=4"),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort logic for Latest (from the fetched 12 items)
  const latest = [...products]
    .sort((a, b) => new Date(b.creationAt) - new Date(a.creationAt))
    .slice(0, 4);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="rounded-2xl border bg-white p-5">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            New arrivals
          </div>
          <h1 className="mt-3 text-2xl font-semibold leading-tight text-slate-900">
            Discover products you’ll love
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Browse categories, view latest items, and manage your shop.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/products"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              Explore products
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Featured products
            </h2>
            <Link to="/products" className="text-sm text-slate-700 underline">
              View all
            </Link>
          </div>

          {/* 6. Solution: Responsive medium, grid 2 columns (md:grid-cols-2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              /* 7. Solution: Responsive product card with flex-col and full height */
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="flex flex-col h-full group rounded-2xl border bg-white p-4 hover:shadow-md transition"
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                  <img
                    src={p.images?.[0] ?? "https://placehold.co/600x400"}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-medium text-slate-900 line-clamp-1">
                      {p.title}
                    </div>
                    <div className="shrink-0 font-bold text-slate-900">
                      ${p.price}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">
                    {p.category?.name}
                  </div>

                  {/* flex-1 here pushes the bottom content down if the card is tall */}
                  <p className="text-sm text-slate-600 line-clamp-2 flex-1">
                    {p.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-xs font-semibold text-slate-400 group-hover:text-slate-900">
                    See Details
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/products"
                className="flex flex-col items-center gap-3 rounded-2xl border bg-white p-4 hover:bg-slate-50 transition"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="text-center">
                  <div className="truncate font-medium text-sm">{c.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Products Section */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Latest products
            </h2>
            <Link to="/products" className="text-sm text-slate-700 underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {latest.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="block rounded-2xl border bg-white p-4 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <div className="truncate font-medium text-slate-900">
                        {p.title}
                      </div>
                      <div className="font-semibold text-slate-900">
                        ${p.price}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.category?.name}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
