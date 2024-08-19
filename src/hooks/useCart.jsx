// src/hooks/useCart.js
import { useDispatch, useSelector } from 'react-redux';
import { incrementCart, addToCart, setCartCount, setCartItems } from '../redux/uiActions';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const useCart = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.ui.cartCount);
  const cartItems = useSelector((state) => state.ui.cartItems);

  useEffect(() => {
    const savedCartCount = Cookies.get('cartCount');
    const savedCartItems = Cookies.get('cartItems');

    if (savedCartCount) {
      dispatch(setCartCount(parseInt(savedCartCount, 10)));
    }

    if (savedCartItems) {
      dispatch(setCartItems(JSON.parse(savedCartItems)));
    }
  }, [dispatch]);

  const handlePlusClick = (item) => {
    const updatedCartItems = [...cartItems, item];
    dispatch(incrementCart());
    dispatch(addToCart(item));

    Cookies.set('cartCount', cartCount + 1, { expires: 7 }); // Store the cart count in cookies for 7 days
    Cookies.set('cartItems', JSON.stringify(updatedCartItems), { expires: 7 }); // Store the cart items in cookies for 7 days
  };

  return {
    handlePlusClick,
    cartCount,
    cartItems,
  };
};

export default useCart;
