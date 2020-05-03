
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    AsyncStorage
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import Layout from '../assets/styles/Layout';
import AppColor from '../assets/styles/colors';
import { scale } from '../utils/FontScaler';
import { NavigateChildRoute } from '../utils/Global';
import AppFonts from '../assets/fonts/';
import AppStyle from '../assets/styles/Layout';
// import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
    mainView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: AppColor.white,
        paddingVertical: scale(5),
        ...Layout.tabShadow
    },
    tabIcon: {
        fontSize: scale(20),
        color: AppColor.gray
    },
    selectedTabIcon: {
        fontSize: scale(20),
        color: AppColor.blue,
        fontFamily: AppFonts.poppinsRegular
    },
    tabText: {
        fontSize: scale(12),
        color: AppColor.darkgrey,
        fontFamily: AppFonts.poppinsRegular
    },
    selectedTabText: {
        fontSize: scale(12),
        color: AppColor.blue,
        fontFamily: AppFonts.poppinsRegular
    },
    signinRow: {
        flexDirection: 'row',
        marginBottom: scale(5)
    },
    signInBtn: {
        backgroundColor: AppColor.blue,
        width: '80%',
        height: scale(35),
        justifyContent: 'center',
        borderRadius: 4,
        alignItems: 'center'
    },
    signInBtnTxt: {
        color: AppColor.white,
        fontSize: scale(16)
    },
});

let tabsBtns = [
    {
        name: 'home',
        text: 'Home',
        route: 'Home',
        icon: (otherStyle) => <Entypo style={[styles.tabIcon, otherStyle]} name={'home'} />,
    },
    {
        name: 'product',
        text: 'Products',
        route: 'Product',
        icon: (otherStyle) => <Ionicons style={[styles.tabIcon, otherStyle]} name={'md-pricetag'} />,
    },
    {
        name: 'recipes',
        text: 'Recipes',
        route: 'Recipes',
        icon: (otherStyle) => <MaterialCommunityIcons style={[styles.tabIcon, otherStyle]} name={'silverware-fork-knife'} />,
    },
    {
        name: 'orders',
        text: 'Orders',
        route: 'Orders',
        icon: (otherStyle) => <MaterialCommunityIcons style={[styles.tabIcon, otherStyle]} name={'file-document'} />,
    },
    {
        name: 'profile',
        text: 'Profile',
        route: 'Profile',
        icon: (otherStyle) => <FontAwesome style={[styles.tabIcon, otherStyle]} name={'user'} />,
    }
]

class TabBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isKeyboardOpen: false
        }
        this.getCartData = '';
    }

    componentWillMount = async () => {
        await this._checkBtn();
    }

    componentDidMount = async () => {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
        this.forceUpdate();
    }

    componentDidUpdate = async () => {
        if (global.loadViewCartBtn) {
            global.loadViewCartBtn = false;
            await this._checkBtn();
            this.forceUpdate();
        }
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            isKeyboardOpen: true
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            isKeyboardOpen: false
        })
    }

    _onPress = (childRoute) => {
        NavigateChildRoute(this.props, 'Dashboard', childRoute)
    }

    _checkBtn = async () => {
        this.getCartData = await AsyncStorage.getItem('addToCart');
    }

    render() {
        const { navigation } = this.props;
        const { isKeyboardOpen } = this.state;
        const currentRoute = navigation.state.routes[0].routes[0].routeName;
        if (isKeyboardOpen) {
            return null;
        } else {
            return (
                <View styles={{ flexDirection: 'column' }}>
                    {
                        this.getCartData && currentRoute != 'Profile'
                            ?
                            <View styles={{ flexDirection: 'row' }}>
                                <View style={styles.signinRow}>
                                    <TouchableOpacity
                                        onPress={() => { navigation.replace('YourCart') }}
                                        style={[AppStyle.blueBtn, { width: '100%', borderRadius: 0 }]}>
                                        <Text style={AppStyle.blueBtnTxt}>View Cart</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
                    }

                    <View styles={{ flexDirection: 'row' }}>
                        <View style={styles.mainView}>
                            {
                                tabsBtns.map((item, key) => {
                                    const { name, text, route, icon } = item;
                                    const selected = currentRoute == route;
                                    return (
                                        <View key={key} style={{ flex: 1, flexDirection: 'column', height: 'auto' }}>
                                            <TouchableOpacity activeOpacity={1} onPress={this._onPress.bind(this, route)}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    {icon(selected ? styles.selectedTabIcon : {})}
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={selected ? styles.selectedTabText : styles.tabText}>{text}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            )
        }

    }
}

export default TabBarComponent;
