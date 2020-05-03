import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity
} from 'react-native';
import AppColor from '../assets/styles/colors';
import { scale } from '../utils/FontScaler';
import LargeCard from '../common/LargeCard';
import ExtraLargeCard from '../common/ExtraLargeCard';
import withProduct, { resetHomeList } from '../redux/Dashboard/action';
import withLogin from '../redux/Login/action';
import withLoader from '../redux/Loader/action';
import { NavigateChildRoute, NavigateParentRoute, GenerateParam } from '../utils/Global';
import AppFonts from '../assets/fonts/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getHomeList } from "../redux/Dashboard/action";
import { store } from "../redux/store";

const itemList = [
  {
    title: 'Products',
    more: 'View all >>',
    onPress: 'Product',
    subList: "products"
  },
  {
    title: 'Recipes',
    more: 'View all >>',
    onPress: 'Recipes',
    subList: "recipes"
  }
]

class Home extends Component {

  constructor(props) {
    super(props);
    this.searchValue = '';
  }

  componentDidMount = async () => {
    setTimeout(async () => {
      const { getHomeList, loginData, setLoader, homeList } = this.props;
      console.log('homeList-----', homeList)
      try {
        if (homeList && homeList.products.length == 0 && homeList.recipes.length == 0) {
          const token = loginData.data._token;
          await setLoader(true);
          const params = `oauth_token=${token}`;
          await getHomeList(params, 'home');
          await setLoader(false);
        }
      } catch (error) {
        console.log('componentDidMount', error)
      }
    }, 500)
  }

  componentWillUnmount = () => {
    if (this.searchValue) {
      store.dispatch(resetHomeList())
    }
  }

  _viewAll = (route) => {
    NavigateChildRoute(this.props, 'Dashboard', route)
  }

  _toggleModal = (item) => {
    NavigateParentRoute(this.props, 'ProductDetails', { selectedProduct: item })
  }


  _toggleModalRecipes = (item) => {
    NavigateParentRoute(this.props, 'RecipeDetails', { selectedProduct: item })
  }


  _renderCard = ({ item, index, subList }) => {
    return (
      <View key={index} style={{ flexDirection: 'row', padding: scale(10) }}>
        {
          (subList != 'products')
            ? //Recipes
            <TouchableOpacity activeOpacity={0.8} onPress={() => { this._toggleModalRecipes(item) }}>
              <ExtraLargeCard {...item} />
            </TouchableOpacity>
            : // Product
            <TouchableOpacity activeOpacity={0.8} onPress={() => { this._toggleModal(item) }}>
              <LargeCard {...item} />
            </TouchableOpacity>
        }
      </View>
    )
  }

  _renderItemList = ({ item, index }) => {
    const { homeList = [] } = this.props;
    const { title, more, onPress, subList } = item;
    return (
      <View key={index} style={styles.mainRow}>
        <View style={{
          flexDirection: 'column',
          flex: 1,
          // paddingHorizontal: scale(12),
        }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.productCol}>
              <Text style={styles.productText}>{title}</Text>
            </View>
            <TouchableOpacity
              onPress={this._viewAll.bind(this, onPress)}
              style={styles.viewAllCol}>
              <Text style={styles.viewAllColText}>{more}</Text>
            </TouchableOpacity>
          </View>
          {
            homeList
              ?
              <FlatList
                style={{ flex: 1, flexDirection: 'row' }}
                data={homeList[subList] || []}
                renderItem={({ item, index }) => this._renderCard({ item, index, subList })}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              />
              : null
          }

        </View>
      </View>
    )
  }

  _search = async () => {
    const { searchHome, loginData, setLoader } = this.props;
    try {
      console.log('this.searchValue', this.searchValue)
      const token = loginData.data._token;
      await setLoader(true);

      let params = GenerateParam({
        "oauth_token": token,
        "limit": 10,
        "page": 1,
        "type": "product",
        "s": this.searchValue
      });
      const product = await searchHome(params, 'home/search');

      params = GenerateParam({
        "oauth_token": token,
        "limit": 10,
        "page": 1,
        "type": "recipe",
        "s": this.searchValue
      });
      const recipe = await searchHome(params, 'home/search');
      const response = { ...product, products: product.products, recipes: recipe.recipes };
      console.log('respone', response)
      store.dispatch(getHomeList(response))

      await setLoader(false);
    } catch (error) {
      await setLoader(false);
      console.log('_search', error)
    }
  }

  render() {
    console.log('homeList', this.props.homeList)
    return (
      <View style={styles.container}>
        <View style={styles.browseRow}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.browseText}>Browse</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: scale(10), }}>
              <View style={styles.searchBox}>
                <FontAwesome name={'search'} style={{
                  paddingLeft: scale(6), backgroundColor: AppColor.transparent,
                  color: AppColor.gray, fontSize: scale(16)
                }} />
                <TextInput
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    backgroundColor: AppColor.transparent,
                    fontSize: scale(16),
                    // paddingTop:scale(20),
                    fontFamily: AppFonts.poppinsRegular,
                    paddingBottom:scale(0)
                  }}
                  autoCorrect={false}
                  underlineColorAndroid={AppColor.white}
                  placeholder={'Search...'}
                  onEndEditing={this._search.bind(this)}
                  value={this.searchValue}
                  onChangeText={(value) => {
                    this.searchValue = value;
                    this.forceUpdate();
                  }}
                  returnKeyType={'search'}
                />
              </View>
            </View>
          </View>
        </View>
        <FlatList
          style={{ width: '100%' }}
          data={itemList}
          renderItem={this._renderItemList}
          showsHorizontalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
};

export default withLoader(withLogin(withProduct(Home)));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
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
  browseRow: {
    backgroundColor: AppColor.black,
    flexDirection: 'row',
    width: "100%",
    paddingVertical: scale(15),
    paddingHorizontal: scale(12)
  },
  browseText: {
    fontSize: scale(25),
    color: AppColor.white,
    fontFamily: AppFonts.AlegreyaBold
  },
  mainRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: scale(10),
    // paddingHorizontal: scale(12),
  },
  productCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: scale(5),
    paddingHorizontal: scale(10)
  },
  productText: {
    fontSize: scale(18),
    fontFamily: AppFonts.AlegreyaBold
  },
  viewAllCol: {
    flex: 1,
    paddingTop: scale(5),
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingHorizontal: scale(10)
  },
  viewAllColText: {
    fontSize: scale(12),
    color: AppColor.blue,
    fontFamily: AppFonts.poppinsRegular
  },
  searchBox: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: AppColor.white,
    borderRadius: 4
  }
});
