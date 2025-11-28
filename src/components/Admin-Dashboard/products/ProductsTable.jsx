import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye, FaBox } from "react-icons/fa";

const ProductsTable = ({
  products,
  selectedProducts,
  toggleSelectProduct,
  toggleSelectAll,
  handleDelete,
}) => {
  const allSelected =
    products.length > 0 && selectedProducts.length === products.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <th className="p-4 w-10">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={allSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
            </th>
            <th className="p-4">Product</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Sold</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr
              key={product._id}
              className="hover:bg-slate-50 transition-colors group"
            >
              <td className="p-4">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => toggleSelectProduct(product._id)}
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                    {product.image?.[0] ? (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FaBox />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="font-medium text-slate-900 line-clamp-1 max-w-[200px]"
                      title={product.name}
                    >
                      {product.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      SKU: {product.sku || "N/A"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {product.category || "Uncategorized"}
                </span>
              </td>
              <td className="p-4 font-medium text-slate-900">
                {product.price?.toLocaleString()}৳
                {product.discount > 0 && (
                  <span className="ml-2 text-xs text-red-500">
                    -{product.discount}%
                  </span>
                )}
              </td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium ${
                      product.quantity > 10
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {product.quantity} units
                  </span>
                  <span className="text-xs text-slate-400">
                    {product.isStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </td>
              <td className="p-4 text-slate-600">{product.sold || 0}</td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* <button 
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button> */}
                  <Link
                    to={`/admin-dashboard/edit-product/${product._id}`}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <FaEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, product._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
