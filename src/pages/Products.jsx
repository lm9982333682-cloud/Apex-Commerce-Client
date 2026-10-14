
import { useEffect, useMemo, useState } from "react";
import { Plus, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import { getAllProducts, deleteProduct as deleteProductApi } from "../services/productService";



const Products = () => {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("table");
  const [productToDelete, setProductToDelete] = useState(null);



  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getAllProducts();
        const productList = Array.isArray(response)
          ? response
          : Array.isArray(response?.products)
            ? response.products
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.data?.products)
                ? response.data.products
                : [];

        const normalizedProducts = productList.map((product) => {
          const firstImage = Array.isArray(product.images)
            ? product.images[0]
            : product.image;
          const imageUrl = typeof firstImage === "string"
            ? firstImage
            : firstImage?.url || firstImage?.secure_url || firstImage?.imageUrl || "";

          return {
            ...product,
            category: typeof product.category === "object"
              ? product.category?.name || "Uncategorized"
              : product.category || "Uncategorized",
            stock: Number(product.stock ?? 0),
            status: product.status || "Active",
            image: product.image || imageUrl,
          };
        });

        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error(error.response?.data?.message || "Unable to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);



  const categories = ["All", ...new Set(products.map((product) => product.category)),];



  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = [product.title, product.category, product._id,].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      const matchesStock = stockFilter === "All" || (stockFilter === "Active" && product.stock > 0) || (stockFilter === "Inactive" && product.stock === 0);
      return matchesSearch && matchesCategory && matchesStock;

    });

  }, [products, search, category, stockFilter]);



  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);



  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };



  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };



  const handleStockChange = (value) => {
    setStockFilter(value);
    setCurrentPage(1);
  };



  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductApi(productToDelete._id);
      setProducts((previousProducts) =>
        previousProducts.filter((product) => product._id !== productToDelete._id)
      );
      toast.success("Product deleted successfully.");
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error(error.response?.data?.message || "Unable to delete product.");
    }
  };



  const handleEdit = (product) => {

    window.location.href = `/products/${product._id}/edit`;

  };



  return (

    <div className="space-y-6">

      <PageHeader

        title="Products"

        description="Manage your product catalog, inventory and pricing."

      >

        <Link

          to="/products/add"

          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"

        >

          <Plus size={18} />

          Add Product

        </Link>

      </PageHeader>



      {/* Product summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">

          <p className="text-sm text-[var(--text-muted)]">Total Products</p>

          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">

            {products.length}

          </p>

        </div>



        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">

          <p className="text-sm text-[var(--text-muted)]">In Stock</p>

          <p className="mt-2 text-2xl font-bold text-[var(--success)]">

            {products.filter((product) => product.stock > 0).length}

          </p>

        </div>



        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">

          <p className="text-sm text-[var(--text-muted)]">Out of Stock</p>

          <p className="mt-2 text-2xl font-bold text-[var(--danger)]">

            {products.filter((product) => product.stock === 0).length}

          </p>

        </div>

      </div>



      {/* Filters */}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] sm:p-5">

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

          <div className="w-full xl:max-w-sm">

            <SearchBar

              value={search}

              onChange={handleSearch}

              placeholder="Search products..."

            />

          </div>



          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">

              <SlidersHorizontal size={17} />

              Filters

            </div>



            <select
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]" aria-label="Filter by category"            >              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}

            </select>



            <select
              value={stockFilter}
              onChange={(event) => handleStockChange(event.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
              aria-label="Filter by stock"
            >
              <option value="All">All Stock</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>



            <div className="flex items-center rounded-lg border border-[var(--border)] p-1">
              <button

                type="button"
                onClick={() => setView("table")}
                aria-label="Table view"
                aria-pressed={view === "table"}
                className={`rounded-md p-2 ${view === "table"
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]"
                  }`}
              >
                <List size={18} />
              </button>
              <button

                type="button"
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={`rounded-md p-2 ${view === "grid"
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]"
                  }`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>

          </div>

        </div>



        {/* Results */}

        <div className="mt-5">

          {isLoading ? (
            <div className="py-16 text-center text-sm text-[var(--text-muted)]">
              Loading products...
            </div>
          ) : paginatedProducts.length > 0 ? (

            view === "table" ? (

              <ProductTable

                products={paginatedProducts}

                onEdit={handleEdit}

                onDelete={setProductToDelete}

              />

            ) : (

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {paginatedProducts.map((product) => (

                  <ProductCard

                    key={product._id}

                    product={product}

                    onEdit={handleEdit}

                    onDelete={() => setProductToDelete(product)}

                  />

                ))}

              </div>

            )

          ) : (

            <div className="py-16 text-center">

              <p className="text-base font-semibold text-[var(--text-primary)]">

                No products found

              </p>

              <p className="mt-2 text-sm text-[var(--text-muted)]">

                Try changing your search or filter options.

              </p>



              <button

                type="button"

                onClick={() => {

                  setSearch("");

                  setCategory("All");

                  setStockFilter("All");

                  setCurrentPage(1);

                }}

                className="mt-4 text-sm font-semibold text-[var(--primary)] hover:opacity-80"

              >

                Clear filters

              </button>

            </div>

          )}

        </div>



        {filteredProducts.length > 0 && (

          <Pagination

            currentPage={currentPage}

            totalPages={totalPages}

            totalItems={filteredProducts.length}

            itemsPerPage={itemsPerPage}

            onPageChange={setCurrentPage}

          />

        )}

      </section>



      {/* Delete confirmation */}

      <ConfirmModal

        isOpen={Boolean(productToDelete)}

        title="Delete Product"

        message={`Are you sure you want to delete "${productToDelete?.title ?? ""

          }"? This action cannot be undone.`}

        confirmText="Delete Product"

        variant="danger"

        onConfirm={handleDelete}

        onCancel={() => setProductToDelete(null)}

      />

    </div>

  );

};



export default Products;
