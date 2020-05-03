import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  FlatList,
  Text,
  StatusBar,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { scale } from '../utils/FontScaler';
import CardView from "../common/CardView";
import withProduct, { getReceipeList } from '../redux/Dashboard/action';
import withLogin from '../redux/Login/action';
import withLoader from '../redux/Loader/action';
import AppColors from '../assets/styles/colors';
import FilterModal from '../common/FilterModal';
import { NavigateChildRoute, NavigateParentRoute } from '../utils/Global';
import AppFonts from '../assets/fonts/';
import { store } from '../redux/store';

class Recipes extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      refreshing: false
    }
    this.currentPage = props.receipeList.max_num_pages || 1;
    this.loadMore = false;
  }

  _toggleModal = (item) => {
    NavigateParentRoute(this.props, 'RecipeDetails', { selectedProduct: item })
  }

  componentDidMount = async () => {
    this._callApi();
  }

  _callApi = async (extraParams, refresh = false, pageNo = 1, loader = true) => {
    const { getReceipeList, loginData, setLoader, receipeList } = this.props;
    if (receipeList.recipes.length == 0 || refresh) {
      await setLoader(loader);
      const params = `oauth_token=${loginData.data._token}&page=${pageNo}&limit=50${extraParams}`;
      const response = await getReceipeList(params, 'recipes/index')
      await setLoader(false);
      return response;
    }
  }

  _renderFilterData = (data) => {
    let params = '';
    Object.keys(data).map((item, key) => {
      params += `&${item}=${data[item] || ''}`
    })
    console.log('_renderFilterData', params)
    this._callApi(params, true);
  }

  _handleRefresh = () => {
    this.currentPage = 1;
    this._callApi('', true);
  }

  _endReached = async () => {
    try {
      const { receipeList } = this.props;
      if (!this.loadMore && this.currentPage <= receipeList.max_num_pages) {
        this.loadMore = true;
        this.forceUpdate();
        let oldReceipeList = receipeList;
        this.currentPage++;
        const newData = await this._callApi('', true, this.currentPage, false);
        console.log('newData', newData)
        this.loadMore = false;
        if (newData.success) {
          oldReceipeList.recipes = [...oldReceipeList.recipes, ...newData.recipes]
          await store.dispatch(getReceipeList(oldReceipeList));
        }
      }
    } catch (error) {
      console.log('_endReached', error)
    }
  }

  render() {
    const { filterModal, receipeList = [] } = this.props;
    const { refreshing } = this.state;
    console.log('receipeList', receipeList)

    return (
      <View style={styles.MainContainer}>
        {/* <Text style={styles.titleText}>Recipes</Text> */}
        {
          receipeList.recipes
            ?
            <View style={{ flex: 1 }}>
              <FlatList
                data={receipeList.recipes}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
                bounces={true}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => this._toggleModal(item)}>
                    <CardView
                      {...item}
                      type={"recipes"}
                      image={{ uri: item.image }}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                refreshing={refreshing}
                onRefresh={this._handleRefresh}
                onEndReached={this._endReached}
                onEndReachedThreshold={0.5}
              />
              {
                this.loadMore
                  ? <ActivityIndicator style={{ marginVertical: scale(10) }} />
                  : null
              }
            </View>
            : <Text style={styles.subtitle}>No Data Found</Text>
        }
        {filterModal ? <FilterModal tabName={'recipes'} _renderFilterData={this._renderFilterData} /> : null}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    backgroundColor: '#455A64',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  MainContainer: {
    flex: 1,
    width: '100%'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  cardViewStyle: {
    width: '80%',
    height: scale(150),
  },
  titleText: {
    fontSize: scale(25),
    paddingHorizontal: scale(10),
    backgroundColor: AppColors.lightBlue,
    fontFamily: AppFonts.AlegreyaBold
  },
  subtitle: {
    fontSize: scale(15),
    paddingHorizontal: scale(10),
    color: AppColors.gray,
    fontFamily: AppFonts.poppinsRegular,
    textAlign: 'center'
  }
});

export default withLoader(withLogin(withProduct(Recipes)));
