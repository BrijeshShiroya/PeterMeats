
import {
  RESET_HOME_LIST, RESET_PRODUCT_LIST, RESET_RECEIPE_LIST, RESET_PROFILE,
  SEARCH_HOME, VIEW_PROFILE, CARD_LIST, ORDER_LIST, GET_CART_DATA,
  SET_USER_LOCATION, GET_RECEIPE_LIST, GET_HOME_LIST, GET_PRODUCT_LIST, SHOW_FILTER_MODAL
} from './type';

const defaultHome = { products: [], recipes: [] };
const HomeReducer = (state = defaultHome, action) => {
  switch (action.type) {
    case GET_HOME_LIST: {
      return action.state
    }
    // case SHOW_FILTER_MODAL: {
    //   return action.state
    // }
    case SEARCH_HOME: {
      return action.state
    }
    case RESET_HOME_LIST: {
      return defaultHome;
    }
    default: {
      return state;
    }
  }
};

const defaultProduct = { products: [] };
const ProductReducer = (state = defaultProduct, action) => {
  switch (action.type) {
    case GET_PRODUCT_LIST: {
      return action.state
    }
    case RESET_PRODUCT_LIST: {
      return defaultProduct
    }
    default: return state
  }
};

const defaultRecipe = { recipes: [] };
const ReceipeReducer = (state = defaultRecipe, action) => {
  switch (action.type) {
    case GET_RECEIPE_LIST: {
      return action.state
    }
    case RESET_RECEIPE_LIST: {
      return defaultRecipe
    }
    default: return state
  }
};

const FilterReducer = (state = false, action) => {
  switch (action.type) {
    case SHOW_FILTER_MODAL:
      return action.state
    default: {
      return state;
    }
  }
}

const LocationReducer = (state = null, action) => {
  switch (action.type) {
    case SET_USER_LOCATION: {
      return action.state
    }
    default: return state
  }
};

const SearchReducer = (state = [], action) => {
  switch (action.type) {
    case SEARCH_HOME: {
      return action.state
    }
    default: return state
  }
};

const defaultProfile = null;
const ProfileReducer = (state = defaultProfile, action) => {
  switch (action.type) {
    case VIEW_PROFILE: {
      return action.state
    }
    case RESET_PROFILE: {
      return defaultProfile
    }
    default: return state
  }
};

const defaultCards = [];
const CardReducer = (state = defaultCards, action) => {
  switch (action.type) {
    case CARD_LIST: {
      return action.state
    }
    default: return state
  }
};

const defaultOrders = { orders: [] };
const OrderReducer = (state = defaultOrders, action) => {
  switch (action.type) {
    case ORDER_LIST: {
      return action.state
    }
    default: return state
  }
};

const defaultCart = { cart: [] };
const CartReducer = (state = defaultCart, action) => {
  switch (action.type) {
    case GET_CART_DATA: {
      return action.state
    }
    default: return state
  }
};

module.exports = {
  HomeReducer,
  ProductReducer,
  ReceipeReducer,
  FilterReducer,
  LocationReducer,
  SearchReducer,
  ProfileReducer,
  CardReducer,
  OrderReducer,
  CartReducer
}
