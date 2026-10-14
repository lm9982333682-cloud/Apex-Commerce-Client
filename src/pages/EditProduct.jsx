
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ImagePlus,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import {
  getProductById,
  updateProduct,
} from "../services/productService";

const categories = [
  "Electronics",
  "Clothing",
  "Footwear",
  "Accessories",
  "Home & Living",
  "Beauty",
  "Other",
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    status: "Active",
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const response = await getProductById(id);
        const product =
          response.product ??
          response.data?.product ??
          response.data;

        if (!product?._id) {
          throw new Error("Product not found.");
        }

        setFormData({
          title: product.title ?? "",
          description: product.description ?? "",
          price: String(product.price ?? ""),
          category:
            product.category?._id ??
            product.category ??
            "",
          stock: String(product.stock ?? ""),
          status: product.status ?? "Active",
        });

        const productImages = product.images ?? [];

        setImages(
          productImages
            .map((image, index) => {
              const imageUrl =
                typeof image === "string"
                  ? image
                  : image?.url;

              if (!imageUrl) return null;

              return {
                id: `existing-${index}`,
                preview: imageUrl,
                file: null,
              };
            })
            .filter(Boolean)
        );
      } catch (error) {
        console.error(
          "Fetch product error:",
          error.response?.data || error
        );

        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load product."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Clean up locally created image previews
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.file && image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      submit: "",
    }));
  };

  // Select new images
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const remainingSlots = 4 - images.length;

    if (remainingSlots <= 0) {
      setErrors((previous) => ({
        ...previous,
        images: "Maximum 4 images are allowed.",
      }));

      event.target.value = "";
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages = validFiles
      .slice(0, remainingSlots)
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        preview: URL.createObjectURL(file),
        file,
      }));

    setImages((previous) => [
      ...previous,
      ...newImages,
    ]);

    if (validFiles.length !== selectedFiles.length) {
      setErrors((previous) => ({
        ...previous,
        images: "Please select image files only.",
      }));
    } else if (selectedFiles.length > remainingSlots) {
      setErrors((previous) => ({
        ...previous,
        images: "Only 4 images are allowed.",
      }));
    } else {
      setErrors((previous) => ({
        ...previous,
        images: "",
      }));
    }

    event.target.value = "";
  };

  // Remove image from preview
  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );

    setErrors((previous) => ({
      ...previous,
      images: "",
    }));
  };

  // Form validation
  const validateForm = () => {
    const nextErrors = {};

    if (formData.title.trim().length < 3) {
      nextErrors.title =
        "Product name must be at least 3 characters.";
    }

    if (!formData.description.trim()) {
      nextErrors.description =
        "Description is required.";
    }

    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      nextErrors.price = "Enter a valid price.";
    }

    if (!formData.category) {
      nextErrors.category =
        "Please select a category.";
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      nextErrors.stock =
        "Enter a valid stock quantity.";
    }

    if (images.length === 0) {
      nextErrors.images =
        "At least one product image is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // Update product using PUT API
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        status: formData.status,
        images,
      };

      const response = await updateProduct(
        id,
        productData
      );

      toast.success(
        response.message ||
          "Product updated successfully!"
      );

      navigate(`/products/${id}`);
    } catch (error) {
      console.error(
        "Update product error:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.errors
          ?.map((item) => item.message)
          .join(", ") ||
        error.response?.data?.message ||
        "Unable to update product.";

      toast.error(message);

      setErrors((previous) => ({
        ...previous,
        submit: message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]";

  const labelClass =
    "text-sm font-semibold text-[var(--text-primary)]";

  if (isLoading) {
    return <Loader message="Loading product details..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/products/${id}`}
          className="mb-3 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
        >
          <ArrowLeft size={17} />
          Back to Product Details
        </Link>

        <PageHeader
          title="Edit Product"
          description="Update the product information below."
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Product Information */}
          <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-6 xl:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                <Pencil size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[var(--text-primary)]">
                  Product Information
                </h2>

                <p className="text-sm text-[var(--text-muted)]">
                  Edit the fields you want to update.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="title"
                className={labelClass}
              >
                Product Name *
              </label>

              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
              />

              {errors.title && (
                <p className="mt-1 text-xs text-[var(--danger)]">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className={labelClass}
              >
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className={`${inputClass} resize-y`}
              />

              {errors.description && (
                <p className="mt-1 text-xs text-[var(--danger)]">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className={labelClass}
                >
                  Price (₹) *
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.price && (
                  <p className="mt-1 text-xs text-[var(--danger)]">
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className={labelClass}
                >
                  Stock Quantity *
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.stock && (
                  <p className="mt-1 text-xs text-[var(--danger)]">
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className={labelClass}
              >
                Category *
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="mt-1 text-xs text-[var(--danger)]">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className={labelClass}
              >
                Product Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </section>

          {/* Image Management */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-6">
            <h2 className="font-semibold text-[var(--text-primary)]">
              Product Images
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Keep up to 4 images.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={images.length >= 4}
              className="mt-5 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-subtle)] p-5 text-center hover:border-[var(--primary)] disabled:opacity-50"
            >
              <ImagePlus
                size={28}
                className="mb-2 text-[var(--primary)]"
              />

              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Add Images
              </span>

              <span className="mt-1 text-xs text-[var(--text-muted)]">
                {images.length}/4 images
              </span>
            </button>

            {errors.images && (
              <p className="mt-2 text-xs text-[var(--danger)]">
                {errors.images}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              {images.map((image, index) => (
                <div
                  key={image.id ?? image.preview}
                  className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)]"
                >
                  <img
                    src={image.preview}
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute right-2 top-2 rounded-full bg-[var(--surface)] p-1.5 text-[var(--danger)] shadow"
                  >
                    <X size={16} />
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-[var(--surface)]/90 px-1 py-1 text-center text-xs font-medium text-[var(--text-primary)]">
                      Main Image
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {errors.submit && (
          <p className="text-sm text-[var(--danger)]">
            {errors.submit}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <Link
            to={`/products/${id}`}
            className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {isSubmitting
              ? "Saving..."
              : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
