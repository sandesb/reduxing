// src/redux/uiReducer.js

import {
  TOGGLE_SIDEBAR,
  SET_LARGE_SCREEN,
  INCREMENT_CART,
  SET_CART_COUNT,
  TOGGLE_CART_POPUP,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_CART_ITEMS, // Import the new action
  SET_SEARCH_RESULTS,
  LOAD_COURSES,
  LOAD_CART_DATA,
} from './uiActions';

import Cookies from 'js-cookie';

const initialState = {
  isSidebarOpen: true,
  isLargeScreen: window.innerWidth >= 1024,
  cartCount: 0,
  isCartPopupVisible: false,
  cartItems: [], // State for cart items
  courses: [], // This should be populated with the data from db.json
  searchResults: [], // To store search results
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CART_DATA:
      return {
        ...state,
        cartItems: action.payload.cartItems,
        cartCount: action.payload.cartItems.length,
      };
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    case SET_LARGE_SCREEN:
      return {
        ...state,
        isLargeScreen: action.payload,
      };
    case INCREMENT_CART:
      return {
        ...state,
        cartCount: state.cartCount + 1,
      };
    case SET_CART_COUNT:
      return {
        ...state,
        cartCount: action.payload,
      };
    case TOGGLE_CART_POPUP:
      return {
        ...state,
        isCartPopupVisible: !state.isCartPopupVisible,
      };
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload], // Add new item to cart
      };
      case SET_CART_ITEMS:
        return {
          ...state,
          cartItems: action.payload,
          cartCount: action.payload.length,
        };
        case REMOVE_FROM_CART:
          const updatedCartItems = state.cartItems.filter((_, i) => i !== action.payload);
          Cookies.set('cartItems', JSON.stringify(updatedCartItems), { expires: 7 });
          return {
            ...state,
            cartItems: updatedCartItems,
            cartCount: updatedCartItems.length, // Update cartCount based on updated cartItems
          };
    case SET_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload, // Set cart items from loaded cookies
      };
      case LOAD_COURSES:
      return {
        ...state,
        courses: action.payload, // Load courses into state
      };
      case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
    default:
      return state;
  }
};

export default uiReducer;
