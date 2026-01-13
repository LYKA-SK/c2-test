import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductNew() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch real categories to avoid "Category Not Found" errors
  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.slice(0, 5))) // Take the first 5 available
      .catch((err) => console.error("Could not load categories", err));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const newProduct = {
      title: formData.get("title"),
      price: Number(formData.get("price")),
      description: formData.get("description"),
      categoryId: Number(formData.get("categoryId")),
      // Direct image URL is required
      images: [formData.get("image")],
    };

    try {
      const response = await fetch(
        "https://api.escuelajs.co/api/v1/products/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("successfully saved a new product");
        navigate("/products");
      } else {
        // Show the specific error from the API
        alert(
          `saved a new product failed: ${result.message || "Check your data"}`
        );
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("saved a new product failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6 mx-auto p-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Add new product
        </h1>
        <p className="text-sm text-slate-600">
          Ensure Category and Image URL are valid.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            name="title"
            required
            minLength={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Min 4 characters"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Price ($)
            </label>
            <input
              name="price"
              type="number"
              required
              min={1}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
            />
          </div>

          {/* Category Dropdown: Fixes the "Category Not Found" error */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              name="categoryId"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Image URL
          </label>
          <input
            name="image"
            type="url"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
            placeholder="https://i.imgur.com/QkIa5tT.jpeg"
          />
          <p className="mt-1 text-xs text-slate-500 italic">
            Use direct links ending in .jpg or .png
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-lg px-6 py-2 text-sm font-medium text-white transition ${
              isSubmitting ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save product"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-slate-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
