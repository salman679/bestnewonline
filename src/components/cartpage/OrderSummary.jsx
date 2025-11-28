import React from "react";

function RightSidebar({ shipping, tax, total, subtotal }) {
  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <div className="flex border border-blue-600 overflow-hidden rounded-md mb-10">
        <input
          type="email"
          placeholder="Promo code"
          className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2.5"
        />
        <button
          type="button"
          className="btn-minimal btn-primary rounded-l-none px-6 text-sm"
        >
          Apply
        </button>
      </div>
      <h3 className="text-lg font-bold border-b pb-2">Order Summary</h3>
      <ul className="mt-4 space-y-2">
        <li className="flex justify-between">
          Subtotal:{" "}
          <span className="font-bold">
            {subtotal.toFixed(0)}
            <span className="text-2xl font-bold">৳</span>
          </span>
        </li>
        <li className="flex justify-between">
          Shipping:{" "}
          <span className="font-bold">
            {shipping.toFixed(0)}
            <span className="text-2xl font-bold">৳</span>
          </span>
        </li>
        <li className="flex justify-between">
          Tax:{" "}
          <span className="font-bold">
            {tax.toFixed(0)}
            <span className="text-2xl font-bold">৳</span>
          </span>
        </li>
        <li className="flex justify-between font-bold text-lg">
          Total:{" "}
          <span>
            {total.toFixed(0)}
            <span className="text-2xl font-bold">৳</span>
          </span>
        </li>
      </ul>
      <button className="btn-minimal btn-primary w-full mt-4">Checkout</button>
    </div>
  );
}

export default RightSidebar;
