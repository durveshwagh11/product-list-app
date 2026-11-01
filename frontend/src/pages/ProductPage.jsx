import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, CalendarIcon, PackageXIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import ProductFields from "../components/ProductFields";
import ProductImage from "../components/ProductImage";
import { formatDate, formatPrice } from "../lib/format";

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:gap-12 md:grid-cols-2">
      <div className="skeleton aspect-square rounded-3xl" />
      <div className="space-y-4">
        <div className="skeleton h-10 w-3/4" />
        <div className="skeleton h-8 w-1/3" />
        <div className="skeleton h-4 w-1/4" />
      </div>
    </div>
  );
}

function ProductPage() {
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const isOwner = user && currentProduct?.user_id === user.id;
  const ready = currentProduct?.id === Number(id);

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      if (await deleteProduct(id)) navigate("/");
    }
  };

  if (error && !loading) {
    return (
      <main className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="mx-auto size-16 rounded-2xl bg-error/10 text-error grid place-items-center">
          <PackageXIcon className="size-8" />
        </div>
        <h1 className="text-2xl font-bold mt-6">{error}</h1>
        <p className="text-base-content/60 mt-2">It may have been removed by its owner.</p>
        <Link to="/" className="btn btn-primary mt-8">
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="btn btn-ghost btn-sm gap-2 mb-6 -ml-3">
        <ArrowLeftIcon className="size-4" />
        All products
      </Link>

      {!ready ? (
        <DetailSkeleton />
      ) : (
        <div className="grid gap-8 lg:gap-12 md:grid-cols-2">
          {/* IMAGE (owner sees a live preview of the URL being edited) */}
          <div className="aspect-square rounded-3xl overflow-hidden bg-base-300 border border-base-content/5 md:sticky md:top-24 self-start">
            <ProductImage
              src={isOwner ? formData.image : currentProduct.image}
              alt={currentProduct.name}
              className="size-full"
            />
          </div>

          <div className="space-y-8">
            {/* DETAILS */}
            <div>
              {isOwner && (
                <span className="badge badge-primary badge-outline mb-4">Your listing</span>
              )}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {currentProduct.name}
              </h1>
              <p className="text-3xl font-bold text-primary mt-4">
                {formatPrice(currentProduct.price)}
              </p>
              <p className="flex items-center gap-2 text-sm text-base-content/60 mt-4">
                <CalendarIcon className="size-4" />
                Listed {formatDate(currentProduct.created_at)}
              </p>
            </div>

            {/* EDIT FORM (owner only) */}
            {isOwner && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProduct(id);
                }}
                className="rounded-3xl bg-base-100 border border-base-content/5 p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold">Edit listing</h2>
                <ProductFields formData={formData} setFormData={setFormData} />

                <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-ghost text-error hover:bg-error/10"
                  >
                    <Trash2Icon className="size-4" />
                    Delete
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary min-w-40"
                    disabled={loading || !formData.name || !formData.price || !formData.image}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="size-4" />
                        Save changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
export default ProductPage;
