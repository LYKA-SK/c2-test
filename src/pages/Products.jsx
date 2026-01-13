import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 5. Download 12 items from API get: products
  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=12")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500 text-sm">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-600">Manage your product catalog</p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          + Add product
        </Link>
      </div>

      {/* 6. Solution: grid-cols-1 by default, md:grid-cols-2 (2 columns on medium) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          /* 7. Card Solution: flex-col and h-full to make all cards equal height */
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="group flex flex-col h-full rounded-2xl border bg-white p-4 hover:shadow-md transition-all duration-300"
          >
            {/* Image Container */}
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <img
                src={p.images?.[0] ?? "https://placehold.co/600x400"}
                alt={p.title}
                className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Content Area - flex-1 pushes the price to the bottom */}
            <div className="mt-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">
                    {p.category?.name}
                  </p>
                </div>
                <div className="shrink-0 font-bold text-slate-900">
                  ${p.price}
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed flex-1">
                {p.description}
              </p>

              {/* Action/Footer Area */}
              <div className="mt-4 pt-4 border-t border-slate-50">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
