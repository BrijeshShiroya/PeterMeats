import { connect } from "react-redux";
import CommonUtils from '../../utils/CommonUtils';
import { LOGIN, RESET_LOGIN } from './type';

export const doLogin = (state) => ({
  type: LOGIN,
  state,
});

// RESET start
export const resetLogin = () => ({ type: RESET_LOGIN });
// RESET end

const mapStateToProps = (state) => ({
  loginData: state.LoginReducer
});

const mapDispatchToProps = (dispatch) => ({
  doLogin: async (data) => {
    const response = await CommonUtils.postData(data, 'auth');
    console.log('response', response)
    dispatch(doLogin(response))
    return response;
  },

  forgotPassword: async (data) => {
    const response = await CommonUtils.postData(data, 'forgot-password');
    console.log('response', response)
    // dispatch(doLogin(response))
    return response;
  },

  signUp: async (data) => {
    const response = await CommonUtils.postData(data, 'singup');
    console.log('response', response)
    // dispatch(doLogin(response))
    return response;
  },

  verifyOTP: async (data) => {
    const response = await CommonUtils.postData(data, 'verify-otp');
    console.log('response', response)
    // dispatch(doLogin(response))
    return response;
  },
});

export default connect(mapStateToProps, mapDispatchToProps);