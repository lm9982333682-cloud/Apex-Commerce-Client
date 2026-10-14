import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ImagePlus, X, PackagePlus, Save } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { createProduct } from "../services/productService";
import { toast } from "react-toastify";



const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);


  const [formData, setFormData] = useState({

    title: "",

    description: "",

    price: "",

    category: "",

    stock: "",

    status: "Active",

    sizes: [],

  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const categories = ["Electronics", "Clothing", "Footwear", "Accessories", "Home & Living", "Beauty", "Other",];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "Standard"];

  const handleSizeChange = (size) => {

    setFormData((previous) => ({
      ...previous, sizes: previous.sizes.includes(size)
        ? previous.sizes.filter((item) => item !== size)
        : [...previous.sizes, size],
    }));

    setErrors((previous) => ({ ...previous, sizes: "" }));
  };



  const handleChange = (event) => {

    const { name, value } = event.target;



    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));



    setErrors((previous) => ({

      ...previous,

      [name]: "",

    }));

  };



  const handleImageChange = (event) => {

    const selectedFiles = Array.from(event.target.files || []);

    const remainingSlots = 4 - images.length;



    if (remainingSlots <= 0) {

      setErrors((previous) => ({

        ...previous,

        images: "You can upload a maximum of 4 images.",

      }));

      event.target.value = "";

      return;

    }



    const validFiles = selectedFiles.filter((file) =>

      file.type.startsWith("image/")

    );



    const newFiles = validFiles.slice(0, remainingSlots);



    setImages((previous) => [

      ...previous,

      ...newFiles.map((file) => ({

        file,

        preview: URL.createObjectURL(file),
      })),

    ]);



    if (selectedFiles.some((file) => !file.type.startsWith("image/"))) {
      setErrors((previous) => ({ ...previous, images: "Please select image files only." }));
    } else if (selectedFiles.length > remainingSlots) {
      setErrors((previous) => ({ ...previous, images: "Only 4 images are allowed.", }));
    } else {
      setErrors((previous) => ({ ...previous, images: "", }));
    }

    event.target.value = "";

  };



  const removeImage = (index) => {
    setImages((previous) => {
      const imageToRemove = previous[index];
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return previous.filter((_, imageIndex) => imageIndex !== index);
    });
  };



  const validateForm = () => {
    const newErrors = {};
    if (formData.title.trim().length < 3) {
      newErrors.title = "Product name must be at least 3 characters.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }
    if (formData.price === "" || Number(formData.price) < 0) {
      newErrors.price = "Enter a valid price.";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }



    if (formData.stock === "" || !Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {

      newErrors.stock = "Enter a valid stock quantity.";

    }



    if (formData.sizes.length === 0) {
      newErrors.sizes = "Please select at least one size.";
    }

    if (images.length === 0) {

      newErrors.images = "Please upload at least one image.";

    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };






  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes,
        images,
      };

      const response = await createProduct(productData);

      toast.success(response.message || "Product created successfully!");

      setTimeout(() => {
        navigate("/products");
      }, 1400);

    } catch (error) {
      console.error("Create product error:", error.response?.data || error);

      const message =
        error.response?.data?.errors
          ?.map((item) => item.message)
          .join(", ") ||
        error.response?.data?.message ||
        "Unable to create product.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };





  const inputClass = "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]";
  const labelClass = "text-sm font-semibold text-[var(--text-primary)]";

  return (

    <div className="space-y-6">

      <div>

        <Link to="/products"
          className="mb-3 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>



        <PageHeader
          title="Add Product"
          description="Add a new product to your store catalog."
        />

      </div>



      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Main Form */}

          <div className="space-y-6 xl:col-span-2">

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">

                  <PackagePlus size={20} />

                </div>



                <div>

                  <h2 className="font-semibold text-[var(--text-primary)]">

                    Basic Information

                  </h2>

                  <p className="text-sm text-[var(--text-muted)]">

                    Enter your product details.

                  </p>

                </div>

              </div>



              <div className="space-y-5">

                <div>

                  <label htmlFor="title" className={labelClass}>

                    Product Name *

                  </label>



                  <input

                    id="title"

                    name="title"

                    type="text"

                    value={formData.title}

                    onChange={handleChange}

                    placeholder="Enter product name"

                    className={inputClass}

                  />



                  {errors.title && (

                    <p className="mt-1 text-xs text-[var(--danger)]">

                      {errors.title}

                    </p>

                  )}

                </div>



                <div>

                  <label htmlFor="description" className={labelClass}>

                    Description *

                  </label>



                  <textarea

                    id="description"

                    name="description"

                    rows={5}

                    value={formData.description}

                    onChange={handleChange}

                    placeholder="Describe your product..."

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

                    <label htmlFor="price" className={labelClass}>

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

                      placeholder="Enter price"

                      className={inputClass}

                    />



                    {errors.price && (

                      <p className="mt-1 text-xs text-[var(--danger)]">

                        {errors.price}

                      </p>

                    )}

                  </div>



                  <div>

                    <label htmlFor="stock" className={labelClass}>

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

                      placeholder="Enter quantity"

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

                  <label htmlFor="category" className={labelClass}>

                    Category *

                  </label>



                  <select

                    id="category"

                    name="category"

                    value={formData.category}

                    onChange={handleChange}

                    className={inputClass}

                  >

                    <option value="">Select category</option>



                    {categories.map((category) => (

                      <option key={category} value={category}>

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
                  <p className={labelClass}>Sizes *</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Select one or more sizes for this product.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {sizeOptions.map((size) => {
                      const isSelected = formData.sizes.includes(size);

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeChange(size)}
                          aria-pressed={isSelected}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${isSelected
                            ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--primary)]"
                            }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {errors.sizes && (
                    <p className="mt-2 text-xs text-[var(--danger)]">
                      {errors.sizes}
                    </p>
                  )}
                </div>

              </div>

            </section>



            {/* Image Upload */}

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-6">

              <div className="mb-5">

                <h2 className="font-semibold text-[var(--text-primary)]">

                  Product Images *

                </h2>



                <p className="mt-1 text-sm text-[var(--text-muted)]">

                  Upload 1–4 images. PNG, JPG or WebP recommended.

                </p>

              </div>



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

                onClick={() => fileInputRef.current?.click()}

                disabled={images.length >= 4}

                className="flex min-h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-subtle)] p-5 text-center transition-colors hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"

              >

                <ImagePlus

                  size={30}

                  className="mb-3 text-[var(--primary)]"

                />



                <span className="text-sm font-semibold text-[var(--text-primary)]">

                  Click to upload images

                </span>



                <span className="mt-1 text-xs text-[var(--text-muted)]">

                  {images.length}/4 images selected

                </span>

              </button>



              {errors.images && (

                <p className="mt-2 text-xs text-[var(--danger)]">

                  {errors.images}

                </p>

              )}



              {images.length > 0 && (

                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">

                  {images.map((image, index) => (

                    <div

                      key={`${image.file.name}-${index}`}

                      className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)]"

                    >

                      <img

                        src={image.preview}

                        alt={`Product preview ${index + 1}`}

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

                        <span className="absolute bottom-0 left-0 right-0 bg-[var(--surface)]/90 px-2 py-1 text-center text-xs font-medium text-[var(--text-primary)]">

                          Main Image

                        </span>

                      )}

                    </div>

                  ))}

                </div>

              )}

            </section>

          </div>



          {/* Sidebar */}

          <aside className="space-y-6">

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">

              <h2 className="font-semibold text-[var(--text-primary)]">

                Product Status

              </h2>



              <label htmlFor="status" className="mt-5 block text-sm text-[var(--text-secondary)]">

                Visibility

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



              <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">

                Active products can be shown in your store. Inactive

                products can be hidden.

              </p>

            </section>



            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">

              <h2 className="font-semibold text-[var(--text-primary)]">

                Product Preview

              </h2>



              <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">

                {images.length > 0 ? (

                  <img

                    src={images[0].preview}

                    alt="Main product preview"

                    className="aspect-square w-full object-cover"

                  />

                ) : (

                  <div className="flex aspect-square flex-col items-center justify-center bg-[var(--surface-subtle)] text-[var(--text-muted)]">

                    <ImagePlus size={35} />

                    <p className="mt-2 text-xs">No image selected</p>

                  </div>

                )}



                <div className="space-y-2 p-4">

                  <p className="font-semibold text-[var(--text-primary)]">

                    {formData.title || "Product Name"}

                  </p>



                  <p className="text-sm text-[var(--text-muted)]">

                    {formData.category || "Product Category"}

                  </p>



                  <p className="text-lg font-bold text-[var(--primary)]">

                    {formData.price

                      ? `₹${Number(formData.price).toLocaleString("en-IN")}`

                      : "₹0"}

                  </p>



                  <p className="text-xs text-[var(--text-muted)]">

                    Stock: {formData.stock || "0"}

                  </p>

                </div>

              </div>

            </section>

          </aside>

        </div>



        {errors.submit && (

          <p className="text-sm text-[var(--danger)]">{errors.submit}</p>

        )}



        {/* Form Actions */}

        <div className="flex flex-wrap justify-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">

          <Link

            to="/products"

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

            {isSubmitting ? "Saving..." : "Save Product"}

          </button>

        </div>

      </form>

    </div>

  );

};



export default AddProduct;
