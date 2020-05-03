
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
import withHome from '../redux/Dashboard/action';

class DeliveryAddress extends Component {
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

    componentDidMount = () => {
        console.log('userLocation', this.props.userLocation)
        const { userLocation, change } = this.props;
        try {
            change('currentLocation', userLocation.description)
        } catch (error) {
            console.log('userLocation', error)
        }
    }

    renderSeparator = () => {
        return (
            <View style={paymentdeliveryStyles.sepatator} />
        );
    };

    selectedOption = (currentScreen) => {
        this.props.selectedOption(currentScreen)
    }

    renderGooglePlaceAutocomplete = () => {
        const { currentAddress } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <ReduxField
                    style={deliveryStyles.emailField}
                    name="currentLocation"
                    placeholder={'Current Location'}
                    placeholderTextColor={colors.black}
                />
            </View>
        )
    }

    handleSearchAddress = (value) => {
        global.mapBtnEvent = value;
        NavigateChildRoute(this.props, 'Dashboard', 'CustomerLocation');
    }

    render() {
        return (
            <View style={deliveryStyles.container}>
                <View style={[deliveryStyles.childContainerRow, deliveryStyles.titleMainRow]}>
                    <View style={[deliveryStyles.childContainerCol]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={deliveryStyles.titleCol1}>
                                <TouchableOpacity onPress={this.selectedOption.bind(this, 0)}>
                                    <Fontisto name={'close-a'} style={deliveryStyles.closeBtn} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={deliveryStyles.title}>  Delivery</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[deliveryStyles.cardContainerStyle, { height: scale(300), justifyContent: 'flex-start', alignItems: 'flex-start', ...Layout.shadow }]}>
                    <View style={[deliveryStyles.subRow, { justifyContent: 'flex-start' }]}>
                        <Text style={{ fontSize: scale(14), fontFamily: AppFonts.poppinsSemiBold, color: AppColor.black, marginLeft: '5%', marginTop: '5%' }}>DELIVERY ADDRESS</Text>
                    </View>
                    <View style={deliveryStyles.subRow}>
                        {
                            this.renderGooglePlaceAutocomplete()
                        }
                    </View>
                    <View style={deliveryStyles.subRow}>
                        <TouchableOpacity
                            onPress={this.handleSearchAddress.bind(this, 0)}
                            style={AppStyle.blueBtn}>
                            <Text style={AppStyle.blueBtnTxt}>Search for Address</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={deliveryStyles.subRow}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Image source={AppImages.ic_gps} 
                            style = {{width:20, height:20}} ></Image>
                            <TouchableOpacity onPress={this.handleSearchAddress.bind(this, 1)}>
                                <Text style={{ color: AppColor.blue, fontWeight: 'normal', fontSize: scale(14), marginLeft: '5%' }}>or use current location</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}

const withForm = reduxForm({
    form: 'Profile',
});

export default withHome(withForm(DeliveryAddress));

const deliveryStyles = StyleSheet.create({
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
})