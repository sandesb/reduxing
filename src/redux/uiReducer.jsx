import {
  TOGGLE_SIDEBAR,
  SET_LARGE_SCREEN,
  INCREMENT_CART,
  SET_CART_COUNT,
  TOGGLE_CART_POPUP,
  TOGGLE_HELP_POPUP,

  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_CART_ITEMS,
  SET_SEARCH_RESULTS,
  LOAD_COURSES,
  LOAD_CART_DATA,
} from "./uiActions";

import Cookies from "js-cookie";

const initialState = {
  isSidebarOpen: true,
  isLargeScreen: window.innerWidth >= 1024,
  cartCount: 0,
  isCartPopupVisible: false,
  isHelpPopupVisible: false,  // Initialize Help Popup visibility state

  cartItems: [],
  courses: [], // State for storing courses fetched from Supabase
  searchResults: [], // To store search results
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_COURSES:
      return {
        ...state,
        courses: action.payload, // Update courses in state
      };
    case SET_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
        cartCount: action.payload.length,
      };
    case REMOVE_FROM_CART:
      const updatedCartItems = state.cartItems.filter(
        (_, i) => i !== action.payload
      );
      Cookies.set("cartItems", JSON.stringify(updatedCartItems), {
        expires: 7,
      });
      return {
        ...state,
        cartItems: updatedCartItems,
        cartCount: updatedCartItems.length, // Update cartCount based on updated cartItems
      };
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
      case TOGGLE_SIDEBAR:
        case 'TOGGLE_SIDEBAR':
          return {
            ...state,
            isSidebarOpen: !state.isSidebarOpen, // Toggle state
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
        isHelpPopupVisible: false,  // Close HelpPopup when CartPopup is toggled

      };
      case TOGGLE_HELP_POPUP:
      return {
        ...state,
        isHelpPopupVisible: !state.isHelpPopupVisible,
        isCartPopupVisible: false,  // Close CartPopup when HelpPopup is toggled

      };
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload], // Add new item to cart
      };
    default:
      return state;
  }
};

export default uiReducer;
