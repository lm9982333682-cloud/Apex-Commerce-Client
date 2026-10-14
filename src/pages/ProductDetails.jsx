
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Pencil,
  Package,
  Tag,
  Boxes,
} from "lucide-react";
import { toast } from "react-toastify";

import Loader from "../components/Loader";
import { getProductById } from "../services/productService";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const response = await getProductById(id);

        const productData =
          response.product ??
          response.data?.product ??
          response.data;

        if (!productData?._id) {
          throw new Error("Product not found.");
        }

        setProduct(productData);
      } catch (error) {
        console.error(
          "Fetch product error:",
          error.response?.data || error
        );

        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load product details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryName = (category) => {
    if (!category) return "N/A";

    if (typeof category === "object") {
      return category.name || "N/A";
    }

    return category;
  };

  const getProductImage = (image) => {
    if (typeof image === "string") {
      return image;
    }

    return image?.url || "";
  };

  if (isLoading) {
    return <Loader message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Product not found
        </h2>

        <p className="text-sm text-[var(--text-secondary)]">
          The requested product could not be loaded.
        </p>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>
      </div>
    );
  }

  const categoryName = getCategoryName(product.category);

  const productImages = (product.images || [])
    .map(getProductImage)
    .filter(Boolean);

  const mainImage =
    productImages[0] ||
    product.image ||
    "";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/products"
            className="mb-3 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Product Details
          </h1>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            View complete information about this product.
          </p>
        </div>

        <Link
          to={`/products/${id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          <Pencil size={17} />
          Edit Product
        </Link>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[var(--surface-subtle)]">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.title || "Product"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-sm text-[var(--text-muted)]">
                No product image available
              </div>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productImages.slice(1).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]"
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-lg bg-[var(--primary-light)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
              {categoryName}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                product.status === "Active"
                  ? "bg-[var(--success-bg)] text-[var(--success)]"
                  : "bg-[var(--danger-bg)] text-[var(--danger)]"
              }`}
            >
              {product.status || "Inactive"}
            </span>
          </div>

          <div>
            <p className="break-all text-sm text-[var(--text-muted)]">
              Product ID: {product._id}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              {product.title}
            </h2>

            <p className="mt-4 text-3xl font-bold text-[var(--primary)]">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="border-t border-[var(--border)]" />

          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">
              Description
            </h3>

            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)]">
              {product.description || "No description available."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Category */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Tag size={18} />
                <span className="text-sm">Category</span>
              </div>

              <p className="mt-2 font-semibold text-[var(--text-primary)]">
                {categoryName}
              </p>
            </div>

            {/* Stock */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Boxes size={18} />
                <span className="text-sm">Available Stock</span>
              </div>

              <p className="mt-2 font-semibold text-[var(--text-primary)]">
                {product.stock ?? 0} units
              </p>
            </div>

            {/* Created At */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Package size={18} />
                <span className="text-sm">Created At</span>
              </div>

              <p className="mt-2 font-semibold text-[var(--text-primary)]">
                {formatDate(product.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
