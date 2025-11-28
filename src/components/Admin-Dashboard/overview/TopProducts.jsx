import { Link } from "react-router-dom";
import { FaBox } from "react-icons/fa";

const TopProducts = ({ products }) => {
  return (
    <div className="h-full overflow-hidden bg-white border shadow-sm rounded-xl border-slate-100">
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Top Products</h3>
        <Link
          to="/admin-dashboard/all-products"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      <div className="p-6 space-y-6">
        {products.map((product, index) => (
          <div key={product._id} className="flex items-center gap-4">
            <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden rounded-lg bg-slate-100">
              {product.image?.[0] ? (
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-400">
                  <FaBox />
                </div>
              )}
              <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br">
                #{index + 1}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className="text-sm font-medium truncate text-slate-900"
                title={product.name}
              >
                {product.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {product.category || "Uncategorized"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">
                {product.price?.toLocaleString()}৳
              </p>
              <p className="text-xs text-slate-500">{product.soldCount} sold</p>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="py-8 text-sm text-center text-slate-500">
            No products data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
