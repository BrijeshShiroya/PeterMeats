import { LOGIN, RESET_LOGIN } from './type';

// Initial State
const initialState = {
  loginData: null,
};

const defaultLogin = null;
const LoginReducer = (state = defaultLogin, action) => {
  switch (action.type) {
    case LOGIN: {
      return action.state
    }
    case RESET_LOGIN: {
      return defaultLogin
    }
    // Default
    default: {
      return state;
    }
  }
};
// Exports
export default LoginReducer;
