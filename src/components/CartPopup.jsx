import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Minus } from 'lucide-react';
import { removeFromCart } from '../redux/uiActions'; // Import the action to remove items

const CartPopup = () => {
  const isCartPopupVisible = useSelector((state) => state.ui.isCartPopupVisible);
  const cartItems = useSelector((state) => state.ui.cartItems);
  const dispatch = useDispatch();

  if (!isCartPopupVisible) return null;

  const handleRemove = (index) => {
    dispatch(removeFromCart(index));
  };

  return (
    <div className="fixed top-16 right-4 w-80 bg-white shadow-lg rounded-lg z-50">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Cart</h2>
      </div>
      <div className="p-4">
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg">{item.title}</span>
                <button onClick={() => handleRemove(index)} className="text-gray-500 hover:text-gray-700">
                  <Minus className="w-6 h-6" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Data</p>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
