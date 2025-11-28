import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const RecentOrdersTable = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-100">
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
        <Link
          to="/admin-dashboard/orders/management"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-500">
                Customer
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-500">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-500">
                Amount
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-500">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-right uppercase text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-slate-900">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 text-xs font-bold rounded-full bg-slate-100 text-slate-500">
                      {order.customerId?.displayName?.[0] || "G"}
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {order.customerId?.displayName || "Guest User"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                  {order.total?.toLocaleString()}৳
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <Link
                    to={`/admin-dashboard/orders/${order._id}`}
                    className="inline-flex items-center gap-1 transition-colors text-slate-400 hover:text-blue-600"
                  >
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
