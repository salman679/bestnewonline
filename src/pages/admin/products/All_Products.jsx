import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../lib/axiosInstanace";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaFilter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const All_Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = products?.map((product) => product.category);
  const uniqueCategories = [...new Set(categories)].filter(Boolean);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance("/products");
        setProducts(res.data.reverse());
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch products", { autoClose: 1000 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await axiosInstance.delete(`/products/${id}`);
      if (res.status === 200) {
        setProducts(products?.filter((product) => product._id !== id));
        toast.success(res.data.message, { autoClose: 1000 });
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed", { autoClose: 1000 });
    }
  };

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = filteredProducts?.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts?.length / itemsPerPage);
  const currentProducts = sortedProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-t-2 border-b-2 border-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog and inventory
          </p>
        </div>
        <Link
          to="/admin-dashboard/add-product"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
        >
          <FaPlus className="text-sm" />
          <span className="font-medium">Add Product</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="text-xs font-medium text-gray-500 uppercase">
            Total Products
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {products.length}
          </p>
        </div>
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="text-xs font-medium text-gray-500 uppercase">
            In Stock
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {products.filter((p) => p.quantity > 0).length}
          </p>
        </div>
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="text-xs font-medium text-gray-500 uppercase">
            Out of Stock
          </p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {products.filter((p) => p.quantity === 0).length}
          </p>
        </div>
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="text-xs font-medium text-gray-500 uppercase">
            Categories
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {uniqueCategories.length}
          </p>
        </div>
      </div>

      {/* Filters & Toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 shadow-sm md:flex-row rounded-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
          />
          <FaSearch className="absolute text-sm text-gray-400 -translate-y-1/2 left-3 top-1/2" />
        </div>

        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-sm min-w-[140px]"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-sm min-w-[140px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-900">
                  Product
                </th>
                <th className="px-6 py-3 font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-6 py-3 font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 font-semibold text-right text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts?.length > 0 ? (
                currentProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 border border-gray-200 rounded-lg">
                          <img
                            src={product.image?.[0]}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="max-w-xs min-w-0">
                          <div
                            className="font-medium text-gray-900 truncate"
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        ৳{product.price}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-xs text-green-600">
                          -{product.discount}% Off
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        {product.quantity} units
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.quantity > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin-dashboard/edit-product/${product._id}`}
                          className="p-2 text-gray-500 transition-colors rounded-lg hover:text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-500 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaBox className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900">
                        No products found
                      </p>
                      <p className="text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedProducts?.length)} of{" "}
              {sortedProducts?.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default All_Products;
