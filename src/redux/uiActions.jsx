// src/redux/uiActions.js
import Cookies from "js-cookie";
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_LARGE_SCREEN = 'SET_LARGE_SCREEN';
export const INCREMENT_CART = 'INCREMENT_CART';
export const SET_CART_COUNT = 'SET_CART_COUNT';
export const TOGGLE_CART_POPUP = 'TOGGLE_CART_POPUP';
export const TOGGLE_HELP_POPUP = 'TOGGLE_HELP_POPUP';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const SET_CART_ITEMS = 'SET_CART_ITEMS'; // New action
export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export const LOAD_COURSES = 'LOAD_COURSES';
export const LOAD_CART_DATA = 'LOAD_CART_DATA';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const toggleSidebar = () => {
  return {
    type: TOGGLE_SIDEBAR,
  };
};

export const setLargeScreen = (isLargeScreen) => {
  return {
    type: SET_LARGE_SCREEN,
    payload: isLargeScreen,
  };
};

export const incrementCart = () => {
  return {
    type: INCREMENT_CART,
  };
};

export const setCartCount = (count) => {
  return {
    type: SET_CART_COUNT,
    payload: count,
  };
};

export const toggleCartPopup = () => {
  return {
    type: TOGGLE_CART_POPUP,
  };
};
export const toggleHelpPopup = () => {
  return {
    type: TOGGLE_HELP_POPUP,
  };
};

export const addToCart = (item) => {
  return {
    type: ADD_TO_CART,
    payload: item,
  };
};

export const removeFromCart = (index) => {
  return {
    type: REMOVE_FROM_CART,
    payload: index,
  };
};

export const setCartItems = (items) => {
  return {
    type: SET_CART_ITEMS,
    payload: items,
  };
};

export const loadCourses = () => {
  return async (dispatch) => {
    try {
      // Query the Supabase database to fetch all courses
      const { data, error } = await supabase.from('db').select('*');

      if (error) {
        console.error('Error loading courses from Supabase:', error);
        return;
      }

      dispatch({
        type: LOAD_COURSES,
        payload: data, // Assuming data is an array of courses
      });
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };
};

export const loadCartData = () => {
  return (dispatch) => {
    const savedCartItems = Cookies.get('cartItems');
    const cartItems = savedCartItems ? JSON.parse(savedCartItems) : [];
    const cartCount = cartItems.length;

    dispatch(setCartItems(cartItems));
    dispatch(setCartCount(cartCount));
  };
};

export const setSearchResults = (query) => {
  console.log("setSearchResults triggered with query:", query);
  return (dispatch, getState) => {
    const { courses } = getState().ui;

    if (typeof query !== 'string' || !query || Array.isArray(query)) {
      console.warn('Query is not a valid string:', query);
      return;
    }

    if (!courses || courses.length === 0) {
      console.warn('Courses data is empty or not loaded correctly.');
      return;
    }

    const filteredResults = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.id.toString().includes(query)
    );

    dispatch({
      type: SET_SEARCH_RESULTS,
      payload: filteredResults,
    });
  };
};




