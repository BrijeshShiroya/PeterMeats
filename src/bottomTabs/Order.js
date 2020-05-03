import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AppColor from '../assets/styles/colors';
import { scale } from '../utils/FontScaler';
import AppColors from "../assets/styles/colors";
import colors from "../assets/styles/colors";
import AppFonts from '../assets/fonts/';
import withLogin from '../redux/Login/action';
import withLoader from '../redux/Loader/action';
import withHome from '../redux/Dashboard/action';
import { GenerateParam } from '../utils/Global';
import Layout from '../assets/styles/Layout';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaymentMethodSelected: false,
      isDeliveryMethodSelected: true,
      isPreferenceSelected: false,
      searchText: '',
      refreshing: false
    }
  }

  componentDidMount = async () => {
    this._callApi();
  }

  _callApi = (refresh = false) => {
    setTimeout(async () => {
      const { getOrderList, loginData, setLoader, orderList = [] } = this.props;
      console.log('orderList', orderList)
      try {
        if (!orderList.orders.length || refresh) {
          const token = loginData.data._token;
          await setLoader(true);
          const params = GenerateParam({
            "oauth_token": token,
            "limit": 100,
            "page": 1
          });
          await getOrderList(params, 'orders/index');
          await setLoader(false);
        }
      } catch (error) {
        console.log('componentDidMount', error)
      }
    }, 500)
  }

  _renderItemList = ({ item, index }) => {
    const { id, total, status, date, products } = item;
    return (
      <View key={index}>
        <View style={styles.cardContainerStyleItem}>
          <View style={styles.cardChildItem}>
            <Text style={styles.leftTextView}>Order</Text>
            <Text style={styles.rightTextView}>{id}</Text>
          </View>
          <View style={styles.cardChildItem}>
            <Text style={styles.leftTextView}>Date</Text>
            <Text style={styles.rightTextView}>{date}</Text>
          </View>
          <View style={styles.cardChildItem}>
            <Text style={styles.leftTextView}>Status</Text>
            <Text style={styles.rightTextView}>{status}</Text>
          </View>

          {this.renderSeparator()}

          {
            products.map((item, key) => {
              const { name, qty, price } = item;
              return (
                <View>
                  <View style={styles.cardChildItem}>
                    <Text style={styles.leftTextView}>Name</Text>
                    <Text style={[styles.rightTextView, { flexWrap: 'wrap' }]}>{name.substr(0, 25) + '...'}</Text>
                  </View>
                  <View style={styles.cardChildItem}>
                    <Text style={styles.leftTextView}>Quantity</Text>
                    <Text style={[styles.rightTextView, { flexWrap: 'wrap' }]}>{qty}</Text>
                  </View>
                  <View style={styles.cardChildItem}>
                    <Text style={styles.leftTextView}>Price</Text>
                    <Text style={[styles.rightTextView, { flexWrap: 'wrap' }]}>{price}</Text>
                  </View>
                </View>
              )
            })
          }

          {this.renderSeparator()}

          <View style={styles.cardChildItem}>
            <Text style={[styles.leftTextView, { fontFamily: AppFonts.poppinsMedium, fontSize: scale(16) }]}>Total </Text>
            <Text style={[styles.rightTextView, { fontFamily: AppFonts.poppinsMedium, fontSize: scale(16), color: AppColor.black }]}>{total}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
          margin: '1%'
        }}
      />
    );
  };

  _handleRefresh = () => {
    this._callApi(true);
  }

  render() {
    const { orderList } = this.props;
    const { refreshing } = this.state;

    console.log('orderList', orderList)
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', backgroundColor: AppColor.black, height: '30%', width: '100%' }}>
          <View style={styles.leftView}>
            <Text style={styles.orderText}>
              Orders
            </Text>
          </View>
        </View>

        <View style={[styles.cardContainerStyle, { height: '100%', width: '95%', paddingBottom: '4%' }]}>

          {
            orderList.orders
              ? <FlatList
                style={{ width: '100%', height: '100%' }}
                data={orderList.orders}
                renderItem={this._renderItemList}
                refreshing={refreshing}
                onRefresh={this._handleRefresh}
              />
              :
              <View style={styles.cardContainerStyleItem}>
                <Text style={[styles.title, { padding : 10,fontFamily: AppFonts.poppinsMedium, fontSize: scale(16), color: AppColor.black }]}>Currently you do not have any past orders to display, but after you’ve completed your first order this is where it will show</Text>
              </View>

          }

        </View>

      </View>
    );
  }
}

export default withHome(withLoader(withLogin(Order)));

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  leftView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    top: '2%',
    left: '2%'
  },
  rightView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    top: '8%',
    right: '2%'
  },
  leftTextView: {
    textAlign: 'left',
    top: '2%',
    left: '2%',
    fontSize: scale(14),
    fontWeight: 'normal',
    padding: '2%',
    color: AppColor.black,
    fontFamily: AppFonts.poppinsRegular
  },
  rightTextView: {
    textAlign: 'right',
    top: '2%',
    right: '2%',
    fontSize: scale(14),
    padding: '2%',
    color: AppColor.darkgrey,
    fontFamily: AppFonts.poppinsRegular
  },
  cardContainerStyle: {
    margin: scale(10),
    flexDirection: "column",
    flex: 1,
    width: '90%',
    position: "absolute",
    marginTop: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cardContainerStyleItem: {
    backgroundColor: AppColors.white,
    margin: '2%',
    borderRadius: 10,
    elevation: 5,
    ...Layout.shadow
  },
  cardChildItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  }
  ,
  leftContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  rightContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  rightIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  productText: {
    fontSize: scale(16),
    fontWeight: 'normal',
    padding: '4%'
  },
  signInBtn: {
    backgroundColor: colors.blue,
    width: '80%',
    height: scale(35),
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center'
  },
  orderText: {
    fontSize: scale(32),
    fontFamily: AppFonts.AlegreyaBold,
    color: AppColor.white,
    marginLeft: '5%',
    marginTop: 5
  }
});
