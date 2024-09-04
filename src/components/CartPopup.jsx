import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus } from "lucide-react";
import { removeFromCart } from "../redux/uiActions";
import { useGetCoursesQuery } from "../redux/coursesApi";
// import ItemDialog from "./ItemDialog"; 

const CartPopup = () => {
  const isCartPopupVisible = useSelector(
    (state) => state.ui.isCartPopupVisible
  );
  const cartItems = useSelector((state) => state.ui.cartItems);
  const dispatch = useDispatch();

  const { data: courses = [], isLoading } = useGetCoursesQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  if (!isCartPopupVisible) return null;

  const handleRemove = (index) => {
    dispatch(removeFromCart(index));
  };

  const handleOpenDialog = (item) => {
    const course = courses.find((course) => course.id === item.id); // Find the full course details
    if (course) {
      setSelectedItem(course);
      setIsDialogOpen(true);
    } else {
      console.error("Course not found for ID:", item.id);
    }
  };

  return (
    <>
      <div className="fixed top-16 right-4 w-80 bg-white shadow-lg rounded-lg z-50">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-700">Things To Study</h2>
        </div>
        <div className="p-4">
          {cartItems.length > 0 ? (
            <ul>
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-lg">{item.title}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
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

      {/* Reuse ItemDialog component for item details */}
      {/* <ItemDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        item={selectedItem}
      /> */}
    </>
  );
};

export default CartPopup;
