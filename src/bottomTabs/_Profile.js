import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  FlatList,
  View,
  TouchableOpacity
} from 'react-native';
import AppColor from '../assets/styles/colors';
import { scale } from '../utils/FontScaler';
import AppImages from '../assets/images';
import AppStyle from '../assets/styles/Layout';
import colors from "../assets/styles/colors";
import ReduxField from "../common/ReduxField";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AppFonts from '../assets/fonts';
import Layout from '../assets/styles/Layout';
import { reduxForm } from 'redux-form';
import { NavigateChildRoute, NavigateParentRoute } from '../utils/Global';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Payment from '../pages/Payment';
import DeliveryAddress from '../pages/DeliveryAddress';
import Preferences from '../pages/Preferences';

const itemList = [
  { title: 'Payment Methods' },
  { title: 'Delivery Address' },
  { title: 'Preferences' },
]

class Profile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isPaymentMethodSelected: false,
      isDeliveryMethodSelected: false,
      isPreferenceSelected: false,
      searchText: '',
      currentAddress: "",
      locationData: [],
      locationName: "",
      locationObj: {},
      connection_Status: false

    }
  }

  _renderItemList = ({ item, index }) => {
    const { title } = item;
    return (
      <View key={index} >
        <View style={{
          flexDirection: 'column',
          flex: 1,
          paddingHorizontal: scale(12),
        }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.productText}>{title}</Text>
          </View>
        </View>
      </View>
    )
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#CED0CE",
          margin: '1%'
        }}
      />
    );
  };

  renderGooglePlaceAutocomplete = () => {
    const { currentAddress } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <ReduxField
          style={styles.emailField}
          name="Current Location"
          placeholder={'Current Location'}
          placeholderTextColor={colors.black}
        />
      </View>
    )
  }

  handleSignout = () => {
    alert('signout clicked!');
  }

  handleAddCreditOrDebitCard = () => {
    alert('credit/debitcard clicked!');
  }

  handleSearchAddress = () => {
    // alert('search address clicked!');
    NavigateChildRoute(this.props, 'Dashboard', 'CustomerLocation');
  }


  _renderMenu = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', paddingVertical: scale(20) }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={profileStyles.list}>{item.title}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
            <AntDesign name='right' style={profileStyles.arrow} />
          </View>
        </View>
        {this.renderSeparator()}
      </TouchableOpacity>
    )
  }

  _onSignout = () => {
    NavigateParentRoute(this.props, 'Login');
  }

  render() {
    //payment view ==================

    return <Preferences/>

    if (this.state.isPaymentMethodSelected) {
      return (
        <View style={styles.container}>
          <View style={[styles.childContainerRow, styles.titleMainRow]}>
            <View style={[styles.childContainerCol]}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.titleCol1}>
                  <TouchableOpacity >
                    <Fontisto name={'close-a'} style={styles.closeBtn} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.title}>  Payment</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.cardContainerStyle, { height: '40%', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: scale(14), fontFamily: AppFonts.poppinsSemiBold, color: AppColor.black, marginLeft: '5%', marginTop: '5%', textAlign: 'left' }}>PAYMENT METHODS</Text>
            <View style={{ flexDirection: 'row', alignItems: "center", height: '20%', width: '90%', marginLeft: '5%', marginTop: '5%' }}>
              <Image source={AppImages.viza}></Image>
              <Text style={{ fontSize: scale(18), fontFamily: AppFonts.poppinsRegular, color: AppColor.black, marginLeft: '5%', textAlign: 'left' }}>**** **** **** 5967</Text>
              <Image source={AppImages.ic_right} style={{ height: '32%', marginLeft: '20%' }}></Image>
            </View>

            {
              this.renderSeparator()
            }

            <View style={{ height: '20%' }}>

            </View>

            <View style={[styles.signInBtn]}>
              <TouchableOpacity
                onPress={this.handleAddCreditOrDebitCard}
                style={AppStyle.blueBtn}>
                <Text style={AppStyle.blueBtnTxt}>Add a Credit or Debit Card</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      );
    }


    //delivery view =====================
    else if (this.state.isDeliveryMethodSelected) {
      return (
        <View style={styles.container}>
          <View style={[styles.childContainerRow, styles.titleMainRow]}>
            <View style={[styles.childContainerCol]}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.titleCol1}>
                  <TouchableOpacity >
                    <Fontisto name={'close-a'} style={styles.closeBtn} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.title}>  Delivery</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.cardContainerStyle, { height: scale(300), justifyContent: 'flex-start', alignItems: 'flex-start', ...Layout.shadow }]}>
            <View style={[styles.subRow, { justifyContent: 'flex-start' }]}>
              <Text style={{ fontSize: scale(14), fontFamily: AppFonts.poppinsSemiBold, color: AppColor.black, marginLeft: '5%', marginTop: '5%' }}>DELIVERY ADDRESS</Text>
            </View>
            <View style={styles.subRow}>
              {
                this.renderGooglePlaceAutocomplete()
              }
            </View>
            <View style={styles.subRow}>
              <TouchableOpacity
                onPress={this.handleSearchAddress}
                style={AppStyle.blueBtn}>
                <Text style={AppStyle.blueBtnTxt}>Search for Address</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.subRow}>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Image source={AppImages.ic_gps}></Image>
                <TouchableOpacity onPress={this.handleSearchAddress}>
                  <Text style={{ color: AppColor.blue, fontWeight: 'normal', fontSize: scale(14), marginLeft: '5%' }}>or use current location</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }

    //preference view ===============
    else if (this.state.isPreferenceSelected) {
      return (
        <View style={styles.container}>

          <View style={{ flexDirection: 'row', backgroundColor: AppColor.black, height: '30%', width: '100%' }}>
            <View style={styles.leftView}>
              <Text style={{
                fontSize: scale(32)
                , fontWeight: 'normal', color: AppColor.white
              }}>
                x Preferences
                            </Text>
            </View>
          </View>

          <View style={[styles.cardContainerStyle, { height: '40%' }]}>

            <View style={{ alignSelf: 'baseline', justifyContent: 'space-between', flexDirection: 'row', margin: '5%' }}>
              <View style={styles.leftContainer}>
                <View style={{
                  backgroundColor: AppColor.gray,
                  borderRadius: 10, height: 80, width: 80, borderRadius: 80 / 2
                }}>
                </View>
              </View>
              <View style={[styles.rightContainer, { marginLeft: '5%', marginTop: '5%' }]}>
                <Text style={{ fontSize: scale(18), fontWeight: 'normal', color: AppColor.black }}> John Doe </Text>
                <Text style={{ fontSize: scale(18), fontWeight: 'normal', color: AppColor.gray }}> Johndoe@outlook.com </Text>
              </View>

            </View>
            <FlatList
              style={{ width: '100%' }}
              data={itemList}
              renderItem={this._renderItemList}
            />
            <View style={[styles.signInBtn, { marginTop: '5%' }]}>
              <TouchableOpacity
                onPress={this.handleSignout}
                style={AppStyle.blueBtn}>
                <Text style={AppStyle.blueBtnTxt}>Sign Out</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      );
    }

    //default profile view =================
    else {
      return (
        <View style={profileStyles.container}>
          <View style={profileStyles.browseRow}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={profileStyles.browseText}>Profile</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: scale(10) }}>
              <TouchableOpacity>
                <Text style={profileStyles.browseText2}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{
            position: 'absolute', top: scale(100), padding: scale(20),
            flex: 1, flexDirection: 'row', ...Layout.shadow, backgroundColor: AppColor.white, borderRadius: 10, marginHorizontal: scale(10)
          }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ marginVertical: scale(20), flex: 1, flexDirection: 'row' }}>
                <View style={{ flexDirection: 'column' }}>
                  <Image style={{ borderRadius: 60, backgroundColor: AppColor.gray, height: scale(60), width: scale(60) }} />
                </View>
                <View style={{ flexDirection: 'column', paddingLeft: scale(10) }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={profileStyles.userName}>John Doe</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={profileStyles.email}>johndoe@outlook.com</Text>
                  </View>
                </View>
              </View>

              <View style={{ marginVertical: scale(20), flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <FlatList
                    data={itemList}
                    bounces={false}
                    renderItem={this._renderMenu}
                  />
                </View>
              </View>

              <View style={profileStyles.signinRow}>
                <TouchableOpacity
                  onPress={this._onSignout.bind(this)}
                  style={[AppStyle.blueBtn, { width: '100%' }]}>
                  <Text style={AppStyle.blueBtnTxt}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }
}

const withForm = reduxForm({
  form: 'Profile',
});

export default withForm(Profile)

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // backgroundColor: 'transparent'
  },
  browseRow: {
    backgroundColor: AppColor.black,
    flexDirection: 'row',
    width: "100%",
    paddingVertical: scale(15),
    paddingHorizontal: scale(12),
    height: scale(200)
  },
  browseText: {
    fontSize: scale(30),
    color: AppColor.white,
    fontFamily: AppFonts.AlegreyaBold
  },
  browseText2: {
    fontSize: scale(16),
    color: AppColor.white,
    fontFamily: AppFonts.poppinsRegular
  },
  userName: {
    fontSize: scale(16),
    color: AppColor.black,
    fontFamily: AppFonts.poppinsSemiBold
  },
  email: {
    fontSize: scale(14),
    color: AppColor.gray,
    fontFamily: AppFonts.poppinsMedium
  },
  list: {
    fontSize: scale(14),
    color: AppColor.black,
    fontFamily: AppFonts.poppinsMedium
  },
  arrow: {
    fontSize: scale(20),
    color: AppColor.gray,
  },
  signinRow: {
    flexDirection: 'row',
  },
  signInBtn: {
    backgroundColor: colors.blue,
    width: '80%',
    height: scale(35),
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center'
  },
  signInBtnTxt: {
    color: colors.white,
    fontSize: scale(16)
  },
})





const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColor.white,
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
  inputContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#231F20",
    alignItems: "center",
    marginTop: scale(10),
    justifyContent: 'center',
    width: '100%'
    //backgroundColor:AppColors.gray
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
  cardContainerStyle: {
    backgroundColor: AppColor.white,
    margin: scale(10),
    flexDirection: "column",
    elevation: 5,
    borderRadius: 4,
    width: '90%',
    position: "absolute",
    marginTop: '30%',
    justifyContent: 'center',
    alignItems: 'center'
  },
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
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.blue,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
  },
  childContainerRow: {
    paddingVertical: scale(14),
    // flex: 1,
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  childContainerCol: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleCol1: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleMainRow: {
    position: 'absolute',
    width: '100%',
    height: scale(150),
    backgroundColor: colors.black,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  title: {
    color: colors.white,
    fontSize: scale(26),
    fontFamily: AppFonts.AlegreyaBold
  },
  closeBtn: {
    color: colors.white,
    fontSize: scale(20),
  },
  emailField: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: scale(10),
    borderRadius: 4,
    width: scale(300),
    height: scale(40)
  },
  signinRow: {
    flexDirection: 'row',
    marginTop: scale(55)
  },
  subRow: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingVertical: scale(5),
    justifyContent: 'center'
  }
});
