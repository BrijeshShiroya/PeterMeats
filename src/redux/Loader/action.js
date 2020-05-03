import { connect } from "react-redux";

export const setLoader = (isLoader) => ({
  type: 'Loader',
  isLoader,
});

const mapStateToProps = (state) => ({
  isLoader: state.LoaderReducer.isLoader
});

const mapDispatchToProps = (dispatch) => ({
  setLoader: (value) => dispatch(setLoader(value))
});

export default connect(mapStateToProps, mapDispatchToProps);