import { connect } from "react-redux";
import CommonUtils from '../../utils/CommonUtils';
import {
  CARD_LIST, ORDER_LIST, GET_CART_DATA,
  RESET_HOME_LIST, RESET_PRODUCT_LIST, RESET_RECEIPE_LIST, RESET_PROFILE,
  VIEW_PROFILE, SET_USER_LOCATION, GET_RECEIPE_LIST, GET_HOME_LIST, GET_PRODUCT_LIST, SHOW_FILTER_MODAL
} from './type';

export const getHomeList = (state) => ({
  type: GET_HOME_LIST,
  state,
});
export const getProductList = (state) => ({
  type: GET_PRODUCT_LIST,
  state,
});
export const getReceipeList = (state) => ({
  type: GET_RECEIPE_LIST,
  state,
});

export const showFilterModal = (state) => ({
  type: SHOW_FILTER_MODAL,
  state,
});

export const viewProfile = (state) => ({
  type: VIEW_PROFILE,
  state,
});

export const orderList = (state) => ({
  type: ORDER_LIST,
  state,
})

export const getCartData = (state) => ({
  type: GET_CART_DATA,
  state,
})

// RESET start
export const resetHomeList = () => ({ type: RESET_HOME_LIST });
export const resetProductList = () => ({ type: RESET_PRODUCT_LIST });
export const resetReceipeList = () => ({ type: RESET_RECEIPE_LIST });
// export const showFilterModal = () => ({ type: RESET_DATA });
export const resetProfile = () => ({ type: RESET_PROFILE });
// RESET end

const mapStateToProps = (state) => ({
  homeList: state.HomeReducer,
  productList: state.ProductReducer,
  receipeList: state.ReceipeReducer,

  filterModal: state.FilterReducer,
  userLocation: state.LocationReducer,
  viewProfileData: state.ProfileReducer,
  // searchHomeList: state.SearchReducer,
  cardList: state.CardReducer,
  orderList: state.OrderReducer,
  cartData: state.CartReducer
});

const mapDispatchToProps = (dispatch) => ({
  getHomeList: async (data, route) => {
    const response = await CommonUtils.getData(data, route);
    await dispatch(getHomeList(response))
    return response;
  },
  getProductList: async (data, route) => {
    const response = await CommonUtils.getData(data, route);
    await dispatch(getProductList(response))
    return response;
  },
  getReceipeList: async (data, route) => {
    const response = await CommonUtils.getData(data, route);
    await dispatch(getReceipeList(response))
    return response;
  },
  getCartData: async (data, route) => {
    const response = await CommonUtils.postData(data, route);
    await dispatch(getCartData(response))
    return response;
  },


  showFilterModal: async (status) => {
    await dispatch(showFilterModal(status))
  },
  getFilterByTab: async (data, route) => {
    const response = await CommonUtils.getData(data, route);
    return response;
  },
  getProductDetailsById: async (data, route) => {
    const response = await CommonUtils.getData(data, route);
    return response;
  },
  setUserLocation: async (state) => {
    await dispatch({
      type: SET_USER_LOCATION,
      state,
    })
  },
  searchHome: async (data, route) => {
    const response = await CommonUtils.getData(data, route);
    return response;
  },
  viewProfile: async (data, route) => {
    const response = await CommonUtils.getData(data, route);
    await dispatch(viewProfile(response))
    return response;
  },
  updateProfile: async (data, route, headers, body) => {
    const response = await CommonUtils.postData(data, route, headers, body);
    return response;
  },
  setCards: async (state) => {
    await dispatch({
      type: CARD_LIST,
      state,
    })
  },
  placeOrder: async (data, route) => {
    const response = await CommonUtils.postData(data, route);
    return response;
  },
  getOrderList: async (data, route) => {
    const response = await CommonUtils.getData(data, route);
    await dispatch(orderList(response));
    return response;
  },
});

export default connect(mapStateToProps, mapDispatchToProps);