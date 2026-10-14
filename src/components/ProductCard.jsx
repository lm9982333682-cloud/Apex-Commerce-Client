
import { Link } from "react-router";
import {
  Eye,
  Pencil,
  Package,
  ImageOff,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const ProductCard = ({
  product,
  onEdit,
}) => {
  const {
    _id,
    id,
    title,
    name,
    image,
    images,
    price,
    category,
    stock,
    status = "Active",
  } = product;

  const productId = _id ?? id;
  const productName = title ?? name ?? "Untitled Product";

  const productImage =
    image ?? (Array.isArray(images) ? images[0] : "");

  const productPrice =
    typeof price === "object" ? price?.amount : price;

  const productCurrency =
    typeof price === "object" ? price?.currency : "INR";

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: productCurrency || "INR",
    maximumFractionDigits: 2,
  }).format(Number(productPrice ?? 0));

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1">
      {/* Product Image */}
      <Link
        to={`/products/${productId}`}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[var(--surface-subtle)]"
      >
        {productImage ? (
          <img
            src={productImage}
            alt={productName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
            <ImageOff size={32} />
            <span className="text-xs">No image available</span>
          </div>
        )}

        <div className="absolute right-3 top-3">
          <StatusBadge status={status} />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <p className="text-xs font-medium text-[var(--text-muted)]">
          {category || "Uncategorized"}
        </p>

        <h3 className="mt-2 truncate text-base font-semibold text-[var(--text-primary)]">
          {productName}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {formattedPrice}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Package size={15} />
            <span>
              {stock ?? 0} in stock
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2 border-t border-[var(--border)] pt-4">
          <Link
            to={`/products/${productId}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)]"
          >
            <Eye size={16} />
            View
          </Link>

          <button
            type="button"
            onClick={() => onEdit?.(product)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
