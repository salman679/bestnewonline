import React from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
function Cart({
  handleRemove,
  handleIncrement,
  handleDecrement,
  quantities,
  prices,
  images,
}) {
  return (
    <div className="md:col-span-2 space-y-4">
      {Object.keys(quantities).map(itemName => (
        <div
          key={itemName}
          className="flex justify-between items-center p-4 border rounded-md"
        >
          <div className="flex items-center gap-4">
            {/* Product Image */}
            <img
              src={images[itemName]}
              alt={itemName}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h3 className="text-lg font-bold max-w-36">{itemName}</h3>
              <p className="text-sm text-gray-500">
                Price: {prices[itemName]}<span className="text-2xl font-bold">৳</span>
              </p>
              <button
                onClick={() => handleRemove(itemName)}
                className="textColor flex items-center mt-2"
              >
                <FaTrash className="mr-1" /> Remove
              </button>
            </div>
          </div>

          {/* Quantity Control */}
          <div className="flex items-center space-x-1 ">
            <button
              onClick={() => handleDecrement(itemName)}
              className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-sm"
            >
              <FaMinus />
            </button>
            <span className="text-lg font-semibold w-8 text-center">
              {quantities[itemName]}
            </span>
            <button
              onClick={() => handleIncrement(itemName)}
              className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-sm"
            >
              <FaPlus />
            </button>
          </div>

          {/* Total Price */}
          <h4 className="text-lg font-bold w-20 text-right">
            ${(quantities[itemName] * prices[itemName]).toFixed(0)}
          </h4>
        </div>
      ))}
    </div>
  );
}

export default Cart;
