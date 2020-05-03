// Initial State
const initialState = {
  isLoader: false,
};
// Reducers (Modifies The State And Returns A New State)
const LoaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'Loader': {
      return {
        ...state,
        isLoader: action.isLoader,
      }
    }
    // Default
    default: {
      return state;
    }
  }
};
// Exports
export default LoaderReducer;
