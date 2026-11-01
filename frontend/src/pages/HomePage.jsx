import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PackageIcon, PlusIcon, RefreshCwIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import ProductCard from "../components/ProductCard";
import AddProductModal, { ADD_PRODUCT_MODAL_ID } from "../components/AddProductModal";

const SORTS = {
  newest: { label: "Newest", compare: (a, b) => new Date(b.created_at) - new Date(a.created_at) },
  "price-asc": { label: "Price: low to high", compare: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.price - a.price },
  name: { label: "Name: A–Z", compare: (a, b) => a.name.localeCompare(b.name) },
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-base-100 border border-base-content/5 overflow-hidden">
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-6 w-1/3" />
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <div className="size-16 rounded-2xl bg-base-100 border border-base-content/5 grid place-items-center">
        <Icon className="size-8 text-base-content/40" />
      </div>
      <h3 className="text-xl font-semibold mt-6">{title}</h3>
      <p className="text-base-content/60 mt-2 max-w-sm">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function HomePage() {
  const { products, loading, error, fetchProducts, resetForm } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((product) => product.name.toLowerCase().includes(q))
      .sort(SORTS[sort].compare);
  }, [products, query, sort]);

  const openAddModal = () => {
    resetForm(); // form state is shared with the edit page
    document.getElementById(ADD_PRODUCT_MODAL_ID).showModal();
  };

  const primaryAction = user ? (
    <button className="btn btn-primary" onClick={openAddModal}>
      <PlusIcon className="size-5" />
      Add product
    </button>
  ) : (
    <Link to="/login?mode=signup" className="btn btn-primary">
      Start selling
    </Link>
  );

  let content;
  if (loading && products.length === 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  } else if (products.length === 0) {
    content = !error && (
      <EmptyState
        icon={PackageIcon}
        title="No products yet"
        text="Be the first to list something. It only takes a few seconds."
        action={primaryAction}
      />
    );
  } else if (visibleProducts.length === 0) {
    content = (
      <EmptyState
        icon={SearchXIcon}
        title="No matches"
        text={`Nothing matches “${query}”. Try a different search.`}
        action={
          <button className="btn btn-ghost" onClick={() => setQuery("")}>
            Clear search
          </button>
        }
      />
    );
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-base-100 border border-base-content/5 px-6 py-10 sm:p-14 mb-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-secondary/20 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <span className="badge badge-primary badge-outline">
            {products.length} {products.length === 1 ? "product" : "products"} listed
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-5">
            Discover great{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              products
            </span>
          </h1>
          <p className="text-base-content/60 text-lg mt-4">
            Browse the catalog, or list your own in seconds.
          </p>
          <div className="mt-8">{primaryAction}</div>
        </div>
      </section>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <label className="input input-bordered flex items-center gap-3 grow bg-base-100 focus-within:border-primary focus-within:outline-none">
          <SearchIcon className="size-4 opacity-50" />
          <input
            type="search"
            placeholder="Search products…"
            className="grow min-w-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </label>
        <div className="flex gap-3">
          <select
            className="select select-bordered bg-base-100 grow sm:grow-0"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            {Object.entries(SORTS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            className="btn btn-square bg-base-100 border-base-content/20"
            onClick={fetchProducts}
            aria-label="Refresh products"
          >
            <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error mb-8">{error}</div>}

      {content}

      {user && <AddProductModal />}
    </main>
  );
}
export default HomePage;
