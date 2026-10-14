
import { Link } from "react-router";
import {
  Eye,
  Pencil,
  Trash2,
  ImageOff,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const ProductTable = ({
  products = [],
  onEdit,
  onDelete,
}) => {
  const getPrice = (price) => {
    const amount =
      typeof price === "object" ? price?.amount : price;

    const currency =
      typeof price === "object" ? price?.currency : "INR";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount ?? 0));
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="bg-[var(--surface-subtle)]">
            <tr>
              {[
                "Product",
                "Category",
                "Price",
                "Stock",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {products.length > 0 ? (
              products.map((product) => {
                const productId = product._id ?? product.id;
                const productName =
                  product.title ?? product.name ?? "Untitled Product";

                const productImage =
                  product.image ??
                  (Array.isArray(product.images)
                    ? product.images[0]
                    : "");

                return (
                  <tr
                    key={productId}
                    className="transition-colors hover:bg-[var(--surface-subtle)]"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--surface-subtle)]">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={productName}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageOff
                              size={20}
                              className="text-[var(--text-muted)]"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-semibold text-[var(--text-primary)]">
                            {productName}
                          </p>

                          <p className="mt-1 text-xs text-[var(--text-muted)]">
                            ID: {productId ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--text-secondary)]">
                      {product.category || "Uncategorized"}
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      {getPrice(product.price)}
                    </td>

                    {/* Stock */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--text-secondary)]">
                      {product.stock ??
                        (Array.isArray(product.sizes)
                          ? product.sizes.reduce(
                              (total, size) =>
                                total + Number(size.stock ?? 0),
                              0
                            )
                          : 0)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={product.status ?? "Active"}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/products/${productId}`}
                          title="View product"
                          aria-label={`View ${productName}`}
                          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--info-bg)] hover:text-[var(--info)]"
                        >
                          <Eye size={17} />
                        </Link>

                        <button
                          type="button"
                          title="Edit product"
                          aria-label={`Edit ${productName}`}
                          onClick={() => onEdit?.(product)}
                          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete product"
                          aria-label={`Delete ${productName}`}
                          onClick={() => onDelete?.(product)}
                          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-[var(--text-muted)]"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
