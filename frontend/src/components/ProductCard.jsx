import { PencilIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import ProductImage from "./ProductImage";
import { formatDate, formatPrice } from "../lib/format";

const ACTION_BTN =
  "btn btn-sm btn-circle border-0 bg-base-100/80 backdrop-blur shadow-md hover:bg-base-100";

function ProductCard({ product }) {
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const user = useAuthStore((state) => state.user);
  const isOwner = user && product.user_id === user.id;
  const productUrl = `/product/${product.id}`;

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.name}"?`)) deleteProduct(product.id);
  };

  return (
    <article className="group relative rounded-2xl bg-base-100 border border-base-content/5 overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <Link
        to={productUrl}
        className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="aspect-[4/3] overflow-hidden bg-base-300">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="size-full transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold leading-snug line-clamp-2">{product.name}</h2>
            {isOwner && <span className="badge badge-primary badge-sm shrink-0">Yours</span>}
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="text-xl font-bold tracking-tight">{formatPrice(product.price)}</p>
            <p className="text-xs text-base-content/50">{formatDate(product.created_at)}</p>
          </div>
        </div>
      </Link>

      {/* OWNER ACTIONS: always visible on touch, on hover/focus on larger screens */}
      {isOwner && (
        <div className="absolute top-3 right-3 flex gap-2 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <Link to={productUrl} className={ACTION_BTN} aria-label="Edit product">
            <PencilIcon className="size-4" />
          </Link>
          <button
            onClick={handleDelete}
            className={`${ACTION_BTN} hover:!bg-error hover:text-error-content`}
            aria-label="Delete product"
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      )}
    </article>
  );
}
export default ProductCard;
