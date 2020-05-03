
import React, { Component } from "react";
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    AsyncStorage,
    Modal,
    Alert,
} from "react-native";
import { scale } from "../utils/FontScaler";
import Layout from '../assets/styles/Layout';
import colors from "../assets/styles/colors";
import { Container, Content } from 'native-base';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NavigateChildRoute, NavigateParentRoute, GenerateParam } from '../utils/Global';
import AppFonts from '../assets/fonts/';
import withHome from '../redux/Dashboard/action';
import withLogin from '../redux/Login/action';
import withLoader from '../redux/Loader/action';
import RadioBtn from '../controls/RadioBtn';
// import RNDateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { reduxForm, reset } from 'redux-form';
import ReduxField from "../common/ReduxField";
import AppStyle from '../assets/styles/Layout';
import { validateEmail } from '../utils/Validation';
import { store } from '../redux/store';
import CommonUtils from '../utils/CommonUtils';
import Geolocation from '@react-native-community/geolocation';

const device = Dimensions.get('window');
const defafaultDateFormate = "YYYY-MM-DD HH:mm";
const defaultDeliveryDate = moment(new Date()).add(1, 'days').toDate();

class YourCart extends Component {
    constructor(props) {
        super(props);

        this.subTotal = 0;
        this.GST = 0;
        this.total = 0;
        this.getCartData = [];
        this.state = {
            changeCard: false,
            isDatePickerVisible: false,
            addUpdateCard: false,
            isDeliveryVisible: false,
            defaultDeliveryDate: defaultDeliveryDate,
            showDliveryCharge: false
        }
        this.cards = [];
        this.selectedCard = 0;
        this.cardReponse = null;
        this.paymentMethod = [
            {
                key: 0,
                value: 'stripe',
                selected: true
            },
            {
                key: 1,
                value: 'cod',
                selected: false
            },
        ];
        this.paymentMethodList = ["stripe"];
        this.selectedPaymentMethod = {};
        this.cartResponse = {
            "store_time": {
                "sunday_business_hours": "closed",
                "monday_business_hours": "7:00|18:00",
                "tuesday_business_hours": "closed",
                "wednesday_business_hours": "7:00|18:00",
                "thursday_business_hours": "7:00|18:00",
                "friday_business_hours": "7:00|18:00",
                "saturday_business_hours": "7:00|17:00"
            },
            "pickup_datetime": "2020-03-23",
            "total": 0,
            "subtotal": "$17.35",
            "gst": "$2.6",
        };
        this.pickup_datetime = null;
        this.userData = {
            "email": "",
            "name": ""
        }
        this.selectedData = "email";
        this.available_delivery = [
            {
                key: 0,
                value: 'pick_up',
                selected: true,
                title: 'Self Pickup'
            },
            {
                key: 1,
                value: 'delivery',
                selected: false,
                title: 'Home Delivery'
            },
        ];
        this.selectedDeliveryMethod = this.available_delivery[0];
        this.delivery_date = null;
        this.DeliveryCharge = 10;
        global.loadViewCartBtn = true;
    }

    componentWillMount = async () => {
        if (!await AsyncStorage.getItem('addToCart')) {
            NavigateChildRoute(this.props, 'Dashboard', 'Home');
        }
    }

    _loadApi = async (updatedCart = []) => {
        let cartData = [];
        try {
            const { userLocation } = this.props;
            console.log('userLocation', userLocation)
            if (userLocation) {
                try {
                    const googleResponse = await CommonUtils.googleApi("70+Edgeware+Rd+Edgeware+Christchurch+NZ", userLocation.description.replace(/\s/g, "+"));
                    console.log('googleResponse', googleResponse)
                    if (googleResponse.rows) {
                        const distanceInMeter = googleResponse.rows[0]["elements"][0]["distance"]["value"];
                        const km = (distanceInMeter * 0.001);
                        if (km > 10) {
                            this.available_delivery = [
                                {
                                    key: 0,
                                    value: 'pick_up',
                                    selected: true,
                                    title: 'Self Pickup'
                                },
                            ];
                        }
                    }
                } catch (error) {
                    console.log('googleResponse', error)
                }
            }
            const { getCartData, setLoader, loginData, viewProfile } = this.props;
            const token = loginData.data._token;
            if (updatedCart) {
                this.getCartData = await AsyncStorage.getItem('addToCart');
                this.getCartData = JSON.parse(this.getCartData);
            } else {
                this.getCartData = updatedCart;
            }
            console.log(' this.getCartData', this.getCartData)
            this.getCartData.map((item, key) => {
                const { quantity, product, selectedVariation = null } = item;
                let { price } = product;
                price = price.replace("$", "");
                const newPrice = selectedVariation && selectedVariation.display_price.replace("$", "") || price
                this.subTotal += (parseFloat(newPrice) * parseFloat(quantity));
                cartData.push({
                    product_id: item.product.ID,
                    variation_id: selectedVariation ? selectedVariation.variation_id : 0,
                    qty: item.quantity
                })
            });

            await setLoader(true);
            let params = { oauth_token: token, cart: cartData };
            this.cartResponse = await getCartData(params, 'cart/view');
            params = `oauth_token=${token}`;
            const res = await viewProfile(params, 'profile');
            console.log('res', res)
            if (res.success) {
                this.userData["email"] = res.user.email;
                this.userData["name"] = res.user.first_name + " " + res.user.last_name;
            }
            console.log('cartResponse', this.cartResponse)
            const { cartResponse } = this;
            if (cartResponse.success) {
                if (!cartResponse.cart.length) {
                    this._clearCart();
                }
                this.paymentMethodList = cartResponse.available_method;
                // available_delivery
                this.available_delivery = [];
                cartResponse.available_delivery.map((item, key) => {
                    if (item == "pick_up") {
                        this.available_delivery.push(
                            {
                                key: 0,
                                value: 'pick_up',
                                selected: true,
                                title: 'Self Pickup'
                            }
                        )
                        this.DeliveryCharge = "Store Collection";
                    }
                    if (item == "delivery") {
                        this.available_delivery.push(
                            {
                                key: 1,
                                value: 'delivery',
                                selected: true,
                                title: 'Home Delivery'
                            }
                        )
                        this.DeliveryCharge = 10;
                        this.total = this.cartResponse.total + this.DeliveryCharge;
                        this.setState({
                            showDliveryCharge: true
                        });
                    }
                })
            }
            // this.subTotal = this.subTotal.toFixed(2);
            // this.total = (parseFloat(this.subTotal) + parseFloat(this.GST) + parseFloat(this.DeliveryCharge));
            // this.total = this.total.toFixed(2);

            console.log('cartResponse', cartResponse);
            await setLoader(false);
            await this._getCards();
            this._onRadioClick(this.paymentMethod, this.paymentMethod[0])
            this.forceUpdate();
        } catch (error) {
            console.log('error', error)
        }
    }

    componentDidMount = async () => {
        this._loadApi();
    }

    _deleteItem = (index) => {
        Alert.alert(
            '',
            'Are you sure to remove?',
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        if (index > -1) {
                            this.getCartData.splice(index, 1);
                            await AsyncStorage.setItem('addToCart', JSON.stringify(this.getCartData));
                            await this._loadApi(this.getCartData);
                            console.log('this.getCartData', this.getCartData)
                        }
                    }
                }
            ]
        )

    }

    _renderItem = ({ item, index }) => {
        const { quantity, product, selectedVariation = null } = item;
        const { price, name, image, description } = product;
        return (
            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this._deleteItem(index)}>
                    <View style={styles.deleteView}>
                        <AntDesign name={'closecircle'} style={styles.delete} />
                    </View>
                </TouchableOpacity>
                <View style={[styles.card, styles.otherCart]}>
                    {
                        selectedVariation != null
                            ?
                            <View key={index} style={styles.orderRow}>
                                <View style={styles.orderCol}>
                                    <Image source={{ uri: image }} style={styles.orderImage} />
                                </View>
                                <View style={styles.orderCol}>
                                    <View style={styles.orderSubRow}>
                                        <Text style={[styles.text4, { fontSize: scale(16), }]}>{name.substr(0, 20)}...</Text>
                                    </View>
                                    <View style={styles.orderSubRow}>
                                        <Text style={[styles.text]}>{description.substr(0, 25)}...</Text>
                                    </View>
                                    <View style={styles.orderSubRow}>
                                        <Text style={[styles.text2]}>{selectedVariation.display_price}</Text>
                                    </View>
                                </View>
                                <View style={styles.itemQty}>
                                    <Text style={styles.qtyText}>{quantity}</Text>
                                </View>
                            </View>
                            :
                            <View key={index} style={styles.orderRow}>
                                <View style={styles.orderCol}>
                                    <Image source={{ uri: image }} style={styles.orderImage} />
                                </View>
                                <View style={styles.orderCol}>
                                    <View style={styles.orderSubRow}>
                                        <Text style={[styles.text4, { fontSize: scale(16) }]}>{name.length > 20 ? name.substr(0, 20) + '...' : name}</Text>
                                    </View>
                                    <View style={styles.orderSubRow}>
                                        <Text style={[styles.text]}>{description.length > 25 ? description.substr(0, 25) + '...' : description}</Text>
                                    </View>
                                    <View style={styles.orderSubRow}>
                                        <Text style={[styles.text2]}>{price}</Text>
                                    </View>
                                </View>
                                <View style={styles.itemQty}>
                                    <Text style={styles.qtyText}>{quantity}</Text>
                                </View>
                            </View>
                    }
                </View>
            </View>
        )
    }

    _renderPayment = ({ item, key }) => {
        return (
            <View key={key} style={styles.childContainerRow2}>
                <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>
                    <Text style={[styles.text, { fontSize: scale(14) }]}>
                        {this.userData[item]}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                    this.selectedData = item;
                    this._toggleModal('addUpdateCard');
                }
                } style={[styles.childContainerCol, { alignItems: 'flex-end' }]}>
                    <Text style={[styles.text2, { fontSize: scale(14) }]}>Change</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _onPress = async () => {
        NavigateChildRoute(this.props, 'Dashboard', 'Product')
    }

    _createSource = async (formData) => {
        try {
            const { loginData } = this.props;
            console.log('login', loginData)
            const email = loginData.data.email;
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${StripeUtils.STRIPE_SK_KEY}`
            }
            const payload = GenerateParam({
                type: 'card',
                "currency": 'nzd',
                'card[number]': formData.cardNumber,
                'card[exp_month]': formData.exp_month,
                'card[exp_year]': formData.exp_year,
                'card[cvc]': formData.cvv,
            })
            return await StripeUtils.postData(payload, headers, 'sources');
        } catch (error) {
            console.log('_createSource', error)
        }
    }

    _toggleModal = (key) => {
        store.dispatch(reset('YourCart'))
        this.setState({
            [key]: !this.state[key]
        });
    }

    _placeOrderApi = async (otherParams) => {
        const { loginData, placeOrder } = this.props;
        const first_name = this.userData["name"].split(" ")[0];
        const last_name = this.userData["name"].split(" ")[1];
        try {
            const token = loginData.data._token;
            const params = {
                oauth_token: token,
                ...otherParams,
                "email": this.userData["email"],
                first_name,
                last_name,
            };
            console.log('params', params)
            const res = await placeOrder(params, 'orders/create');
            console.log('res', res)
            if (res.success) {
                NavigateChildRoute(this.props, 'Dashboard', 'Home');
                await AsyncStorage.setItem('addToCart', '');
                setTimeout(() => {
                    Alert.alert('Order Placed Successfully.');
                }, 3000)
            } else {
                Alert.alert('Error in Order Place.')
            }
        } catch (error) {
            console.log('_placeOrderApi', error)
        }

    }

    _placeOrder = async (callApi = false) => {
        let order_type = "";
        const { userLocation } = this.props;
        if (!userLocation) {
            Alert.alert('Please Add Delivery Address.')
            return;
        }
        if (!this.userData.email || !this.userData.name) {
            Alert.alert('Please Add Name and Email.');
            return
        }
        if (callApi === false) {
            console.log('this.selectedDeliveryMethod', this.selectedDeliveryMethod.value, this.available_delivery[0].value)
            if (this.selectedDeliveryMethod.value == this.available_delivery[0].value) {
                this.delivery_date = null;
                this._toggleModal('isDatePickerVisible');
            } else {
                this.pickup_datetime = null;
                this._toggleModal('isDeliveryVisible');
            }
        } else {
            if (this.selectedDeliveryMethod.value == this.available_delivery[0].value) {
                order_type = "pick_up";
            } else {
                order_type = "delivery";
            }
            const { cardList, setLoader } = this.props;
            try {
                let cart = [];
                console.log('this.getCartData', this.getCartData)
                this.getCartData.map((item, key) => {
                    cart.push({
                        product_id: item.product.ID,
                        variation_id: item.selectedVariation && item.selectedVariation.variation_id || 0,
                        qty: item.quantity
                    })
                })
                const aditionalParams = {
                    ...this.pickup_datetime != null ? { "pickup_datetime": this.pickup_datetime } : {},
                    ...this.delivery_date != null ? { "delivery_date": this.delivery_date } : {},
                    order_type,
                    ...userLocation.locationobj
                }
                switch (this.selectedPaymentMethod.value) {
                    case "cod":
                        await setLoader(true);
                        await this._placeOrderApi({
                            cart,
                            "payment_method": "cod",
                            ...aditionalParams
                        });
                        await setLoader(false);
                        break;
                    case "stripe":
                        if (cardList.length) {
                            await setLoader(true);
                            const sourceResponse = await this._createSource(cardList[0]);
                            console.log('sourceResponse', sourceResponse)
                            if (sourceResponse.id) {
                                await this._placeOrderApi({
                                    cart,
                                    "stripe_source": sourceResponse.id,
                                    ...aditionalParams
                                });
                            }
                            await setLoader(false);
                        } else {
                            setTimeout(() => {
                                Alert.alert('Please Add Card');
                            }, 200)
                        }
                        break;
                }

            } catch (error) {
                console.log('_placeOrder', error)
            }
        }
    }

    _getCards = async () => {
        try {
            const { cardList } = this.props;
            this.cards = (
                <FlatList
                    data={cardList}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                this.selectedCard = index;
                                this._toggleModal('changeCard');
                            }} key={index} style={{ backgroundColor: (this.selectedCard == index) ? colors.blue : colors.white, flexDirection: 'row', paddingVertical: scale(5) }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={styles.card1}>{'**** **** **** ' + item.cardNumber.substr(12, 16)}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    ItemSeparatorComponent={() => <View style={styles.sepatator} />}
                />
            )
        } catch (error) {
            console.log('_getCards', error)
        }
    }

    _addCreditCard = async () => {
        NavigateChildRoute(this.props, 'Dashboard', 'Profile', { currentScreen: 1 })
    }

    _onRadioClick = (data, selectedItem) => {
        this.paymentMethod = data;
        this.selectedPaymentMethod = selectedItem;
        console.log('this.selectedPaymentMethod', this.selectedPaymentMethod)
        this.forceUpdate();
    }

    _onAvailableDelivery = (data, selectedItem) => {
        this.available_delivery = data;
        this.selectedDeliveryMethod = selectedItem;
        console.log('this.selectedDeliveryMethod', this.selectedDeliveryMethod)
        if (this.selectedDeliveryMethod.value == 'delivery') {
            this.setState({
                showDliveryCharge: true
            })
        } else {
            this.setState({
                showDliveryCharge: false
            })
        }
        this.forceUpdate();
    }

    _onOK = (defaultValue) => {
        try {
            const { selectedDate = defaultValue } = this;
            const { store_time } = this.cartResponse;
            const dayString = moment(selectedDate).format('dddd');
            const prefix = "_business_hours";
            const key_store_time = (dayString + prefix).toLowerCase();

            if (store_time[key_store_time] == "closed") {
                Alert.alert(`${dayString} closed.`);
            } else {
                const timeRange = store_time[key_store_time].split("|");
                const timeRangeLog = store_time[key_store_time].replace("|", " To ");
                timeRange[0] = Number(timeRange[0].replace(":00", ''));
                timeRange[1] = Number(timeRange[1].replace(":00", ''));
                const hours = selectedDate.getHours();
                const min = selectedDate.getMinutes();
                if (hours >= timeRange[0] && hours <= timeRange[1]) {
                    this.pickup_datetime = moment(selectedDate).format(defafaultDateFormate);
                    console.log('this.pickup_datetime', this.pickup_datetime)
                    this._placeOrder(true);
                    this._toggleModal('isDatePickerVisible');
                } else {
                    Alert.alert(`${dayString} business hour is ${timeRangeLog}`)
                }
            }
        } catch (error) {
            this._toggleModal('isDatePickerVisible');
            console.log('_onOK', error)
        }
    }

    _onCancel = () => {
        this.delivery_date = null;
        this._toggleModal('isDatePickerVisible');
    }

    _onOKDelivery = (defaultValue) => {
        try {
            const { defaultDeliveryDate } = this.state;
            const currentDateHours = moment(defaultDeliveryDate).format("HH");
            console.log('currentDateHours', currentDateHours);
            const { selectedDate = defaultValue } = this;
            switch (moment(selectedDate).format('dddd')) {
                case "Monday":
                case "Tuesday":
                case "Thursday":
                case "Friday":
                case "Sunday":
                    setTimeout(() => {
                        Alert.alert('Wednesday, Saturday is Open.');
                    }, 200)
                    break;
                default: {
                    const date1 = moment(this.state.defaultDeliveryDate).format("YYYY-MM-DD");
                    const date2 = moment(selectedDate).format("YYYY-MM-DD");
                    console.log('date1', date1, date2)
                    if (Number(currentDateHours) >= 12 && (date1 + '') === (date2 + '')) {
                        this.setState({
                            defaultDeliveryDate: moment(selectedDate).add(1, 'days').toDate(),
                        });
                        Alert.alert('Please Select Next Wednesday or Saturday.');
                    } else {
                        this.delivery_date = moment(selectedDate).format("YYYY-MM-DD");
                        console.log('success---', this.delivery_date)
                        this._placeOrder(true);
                        this._toggleModal('isDeliveryVisible');
                    }

                    break;
                }
            }
        } catch (error) {
            this._toggleModal('isDeliveryVisible');
            console.log('_onOK', error)
        }
    }

    _onCancelDelivery = () => {
        this.pickup_datetime = null;
        this._toggleModal('isDeliveryVisible');
    }

    _onDateChange = (selectedDate) => {
        console.log('this_onDateChange', selectedDate)
        this.selectedDate = selectedDate;
    }

    _updateProfile = (formData) => {
        console.log('_updateProfile', formData)
        const { first_name, last_name, email } = formData;
        let data = '';
        switch (this.selectedData) {
            case "email":
                if (!email) {
                    Alert.alert('Email required');
                    return
                }
                data = email;
                break;
            case "name":
                if (!first_name || !last_name) {
                    Alert.alert('First name, Last name required');
                    return
                }
                data = first_name + " " + last_name;
                break;
        }
        this.userData[this.selectedData] = data;
        this._toggleModal('addUpdateCard');
    }

    _clearCart = async () => {
        await AsyncStorage.setItem('addToCart', "")
        NavigateChildRoute(this.props, 'Dashboard', 'Home');
    }

    _getDirection = () => {
        NavigateChildRoute(this.props, 'Dashboard', 'DirectionsMap')
    }

    render() {
        const { showDliveryCharge, changeCard, isDatePickerVisible, isDeliveryVisible, addUpdateCard, defaultDeliveryDate } = this.state;
        const { cardList, handleSubmit } = this.props;
        const { pickup_datetime } = this.cartResponse;
        return (
            <Container>
                <Content>
                    <View style={styles.container}>
                        <Modal visible={changeCard} animationType={'slide'} transparent={true} >
                            <TouchableOpacity
                                onPress={this._toggleModal.bind(this, 'changeCard')}
                                activeOpacity={1} style={styles.modalRow}>
                                <TouchableOpacity activeOpacity={1} style={styles.modalCol}>
                                    <View style={styles.fieldView}>
                                        {
                                            cardList.length
                                                ? this.cards
                                                : <Text style={[styles.title, { color: colors.black, fontSize: scale(20) }]}>Please add cards</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </Modal>
                        <Modal visible={addUpdateCard} animationType={'slide'} transparent={true} >
                            {
                                this.selectedData === "email"
                                    ?
                                    <TouchableOpacity
                                        onPress={this._toggleModal.bind(this, 'addUpdateCard')}
                                        activeOpacity={1} style={styles.modalRow}>
                                        <TouchableOpacity activeOpacity={1} style={styles.modalCol}>
                                            <View style={styles.fieldView}>
                                                <ReduxField
                                                    style={styles.emailField}
                                                    name="email"
                                                    placeholder={'Email'}
                                                    placeholderTextColor={colors.black}
                                                />
                                            </View>
                                            <View style={styles.signinRow}>
                                                <TouchableOpacity
                                                    onPress={handleSubmit(this._updateProfile.bind(this))}
                                                    style={[AppStyle.blueBtn, { width: '80%', marginTop: scale(10) }]}>
                                                    <Text style={AppStyle.blueBtnTxt}>Update</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={this._toggleModal.bind(this, 'addUpdateCard')}
                                        activeOpacity={1} style={styles.modalRow}>
                                        <TouchableOpacity activeOpacity={1} style={styles.modalCol}>
                                            <View style={styles.fieldView}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                                        <ReduxField
                                                            style={[styles.emailField, { width: scale(100) }]}
                                                            name="first_name"
                                                            placeholder={'First Name'}
                                                            placeholderTextColor={colors.black}
                                                        />
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: scale(5) }}>
                                                        <ReduxField
                                                            style={[styles.emailField, { width: scale(100) }]}
                                                            name="last_name"
                                                            placeholder={'Last Name'}
                                                            placeholderTextColor={colors.black}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.signinRow}>
                                                <TouchableOpacity
                                                    onPress={handleSubmit(this._updateProfile.bind(this))}
                                                    style={[AppStyle.blueBtn, { width: '80%', marginTop: scale(10) }]}>
                                                    <Text style={AppStyle.blueBtnTxt}>Update</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                            }
                        </Modal>
                        <View style={[styles.childContainerRow, styles.titleMainRow]}>
                            <View style={[styles.childContainerCol]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.titleCol1}>
                                        <TouchableOpacity onPress={this._onPress.bind(this)}>
                                            <Fontisto name={'close-a'} style={styles.closeBtn} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={styles.title}>  Your Cart</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.childContainerRow, { marginTop: scale(50) }]}>
                            <View style={styles.childContainerCol}>
                                <View style={styles.card}>
                                    <View style={styles.textRow}>
                                        <View style={styles.textCol}>
                                            <Text style={[styles.text, { fontSize: scale(14) }]}>Subtotal</Text>
                                        </View>
                                        <View style={styles.textCol2}>
                                            <Text style={[styles.text, { fontSize: scale(14) }]}>{this.cartResponse.subtotal}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.textRow}>
                                        <View style={styles.textCol}>
                                            <Text style={[styles.text, { fontSize: scale(14) }]}>GST</Text>
                                        </View>
                                        <View style={styles.textCol2}>
                                            <Text style={[styles.text, { fontSize: scale(14) }]}>{this.cartResponse.gst}</Text>
                                        </View>
                                    </View>
                                    {
                                        showDliveryCharge
                                            ?
                                            <View style={styles.textRow}>
                                                <View style={styles.textCol}>
                                                    <Text style={[styles.text, { fontSize: scale(14) }]}>Delivery Charge</Text>
                                                </View>
                                                <View style={styles.textCol2}>
                                                    <Text style={[styles.text, { fontSize: scale(14) }]}>${this.DeliveryCharge}</Text>
                                                </View>
                                            </View>
                                            : null
                                    }
                                    {/* <View style={styles.textRow}>
                                        <View style={styles.textCol}>
                                            <Text style={[styles.text, { fontSize: scale(14) }]}>GST</Text>
                                        </View>
                                        <View style={styles.textCol2}>
                                            <Text style={[styles.text, { fontSize: scale(14) }]}>${this.GST}</Text>
                                        </View>
                                    </View> */}
                                    {/* <View style={styles.textRow}>
                                        <View style={styles.textCol}>
                                            <Text style={[styles.text, { fontSize: scale(14) }]}>Delivery</Text>
                                        </View>
                                        <View style={styles.textCol2}>
                                            <Text style={[styles.text, { fontSize: scale(14) }]}>Store Collection</Text>
                                        </View>
                                    </View> */}
                                    <View style={styles.textRow}>
                                        <View style={styles.textCol}>
                                            {/* <Text style={styles.text}>Delivery</Text> */}
                                        </View>
                                        <TouchableOpacity onPress={this._getDirection.bind(this)}>
                                            <View style={styles.textCol2}>
                                                <Text style={styles.text2}>Get Directions</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ borderBottomWidth: 0.2 }} />
                                    <View style={styles.textRow}>
                                        <View style={styles.textCol}>
                                            <Text style={styles.text3}>Total</Text>
                                        </View>
                                        <View style={styles.textCol2}>
                                            <Text style={styles.text3}>${this.total}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.childContainerRow}>
                            <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>
                                <Text style={styles.text4}>YOUR ORDER</Text>
                            </View>
                            <View style={[styles.childContainerCol, { alignItems: 'flex-end' }]}>
                                <TouchableOpacity onPress={this._onPress.bind(this)}>
                                    <Text style={styles.text5}>Add more items</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.childContainerCol}>
                            <FlatList
                                data={this.getCartData || []}
                                renderItem={this._renderItem}
                                ItemSeparatorComponent={() => <View style={{ borderWidth: 0, margin: scale(4) }} />}
                            />
                        </View>
                        <View style={styles.childContainerRow}>
                            <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>

                            </View>
                            <View style={[styles.childContainerCol, { alignItems: 'flex-end' }]}>
                                <TouchableOpacity onPress={this._clearCart.bind(this)}>
                                    <Text style={styles.text5}>Clear cart</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.childContainerRow}>
                            <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>
                                <Text style={[styles.text4, { paddingVertical: scale(14) }]}>PAYMENT METHOD</Text>
                            </View>
                        </View>
                        {
                            this.paymentMethodList.indexOf("stripe") > -1
                                ?
                                <View style={styles.childContainerRow2}>
                                    {
                                        cardList.length
                                            ?
                                            <RadioBtn data={this.paymentMethod} selected={this.paymentMethod[0]} onRadioClick={this._onRadioClick} >
                                                <View style={{ flexDirection: 'row', marginHorizontal: scale(10) }}>
                                                    <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>
                                                        <Text style={[styles.text, { fontSize: scale(14) }]}>
                                                            {('**** **** **** ' + cardList[this.selectedCard].cardNumber.substr(12, 16))}
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity onPress={this._toggleModal.bind(this, 'changeCard')} style={[styles.childContainerCol, { alignItems: 'flex-end' }]}>
                                                        <Text style={[styles.text2, { fontSize: scale(14) }]}>Change</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </RadioBtn>
                                            :
                                            <TouchableOpacity onPress={this._addCreditCard.bind(this)} style={[styles.childContainerCol, { flex: 1, alignItems: 'flex-start' }]}>
                                                <Text style={[styles.text2, { fontSize: scale(14) }]}>Add a Credit or Debit Card</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                                : null
                        }

                        <View style={[styles.childContainerRow2,{marginTop :10}]}>
                            {
                                this.paymentMethodList.indexOf("cod") > -1
                                    ?
                                    <RadioBtn data={this.paymentMethod} selected={this.paymentMethod[1]} onRadioClick={this._onRadioClick}>
                                        <View style={{ flexDirection: 'row', marginHorizontal: scale(10) }}>
                                            <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>
                                                <Text style={[styles.text, { fontSize: scale(14) }]}>
                                                    Cash on delivery
                                                </Text>
                                            </View>
                                        </View>
                                    </RadioBtn>
                                    : null
                            }
                        </View>
                        <View style={styles.childContainerRow}>
                            <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>
                                <Text style={styles.text4}>{'order type'.toUpperCase()}</Text>
                            </View>
                        </View>
                        {
                            this.available_delivery.map((item, key) => {
                                const { title } = item;
                                return (
                                    <View style={styles.childContainerRow2}>
                                        <RadioBtn data={this.available_delivery} selected={item} onRadioClick={this._onAvailableDelivery}>
                                            <View style={{ flexDirection: 'row', marginHorizontal: scale(10) }}>
                                                <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>
                                                    <Text style={[styles.text, { fontSize: scale(14) }]}>
                                                        {title}
                                                    </Text>
                                                </View>
                                            </View>
                                        </RadioBtn>
                                    </View>
                                )
                            })
                        }
                        <View style={styles.childContainerRow}>
                            <View style={[styles.childContainerCol, { alignItems: 'flex-start', flex: 1 }]}>
                                <Text style={styles.text4}>NAME AND EMAIL</Text>
                            </View>
                        </View>
                        <FlatList
                            data={Object.keys(this.userData)}
                            renderItem={this._renderPayment}
                        />
                        <View style = {{marginTop :10}}></View>

                    </View>
                    <TouchableOpacity onPress={() => this._placeOrder()} style={Layout.commonBtn}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 5, flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Text style={Layout.commonBtnText}>Place Order</Text>
                            </View>
                            <View style={{ flex: 2.5, flexDirection: 'column', alignItems: 'flex-end', paddingRight: scale(20) }}>
                                <Text style={Layout.commonBtnText}>${this.total}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Modal visible={isDatePickerVisible} transparent={true}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            {/* <Text style={Layout.commonBtnText}>Select Pickup Date</Text> */}
                            <View style={{ height: scale(300), width: scale(300), flexDirection: 'column', backgroundColor: colors.white, borderRadius: 4 }}>
                                <DatePicker
                                    // timeZoneOffsetInMinutes={13}
                                    minimumDate={new Date(pickup_datetime)}
                                    date={new Date(pickup_datetime)}
                                    mode={"datetime"}
                                    // is24Hour={true}
                                    // display="default"
                                    onDateChange={this._onDateChange}
                                />
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={this._onOK.bind(this, new Date(pickup_datetime))} style={Layout.blueBtn}>
                                            <Text style={Layout.blueBtnTxt}>OK</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={this._onCancel.bind(this)} style={Layout.blueBtn}>
                                            <Text style={Layout.blueBtnTxt}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal visible={isDeliveryVisible} transparent={true}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            {/* <Text style={Layout.commonBtnText}>Select Delivery Date</Text> */}
                            <View style={{ height: scale(300), width: scale(300), flexDirection: 'column', backgroundColor: colors.white, borderRadius: 4 }}>
                                <DatePicker
                                    key={defaultDeliveryDate + ""}
                                    // timeZoneOffsetInMinutes={13}
                                    minimumDate={defaultDeliveryDate}
                                    date={defaultDeliveryDate}
                                    mode={"date"}
                                    // is24Hour={true}
                                    // display="default"
                                    onDateChange={this._onDateChange}
                                />
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={this._onOKDelivery.bind(this, defaultDeliveryDate)} style={Layout.blueBtn}>
                                            <Text style={Layout.blueBtnTxt}>OK</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={this._onCancelDelivery.bind(this)} style={Layout.blueBtn}>
                                            <Text style={Layout.blueBtnTxt}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </Content>
            </Container>
        )
    }
}

const initialValues = {
    'first_name': '',
    'last_name': '',
    'email': '',
}

const validate = values => {
    const error = {};
    if (values.first_name == "") {
        error.first_name = 'First Name Required';
    }
    if (values.last_name == "") {
        error.last_name = 'Last Name Required';
    }
    if (values.email == "") {
        error.email = 'Email Required';
    } else if (!validateEmail(values.email)) {
        error.email = 'Invalid Email';
    }
    return error;
};

const withForm = reduxForm({
    form: 'YourCart',
    validate,
    initialValues,
    enableReinitialize: true
});

export default withLoader(withLogin(withHome(withForm(YourCart))));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: scale(20),
        backgroundColor: colors.whitesmoke
    },
    childContainerRow: {
        paddingVertical: scale(14),
        // flex: 1,
        flexDirection: 'row',
        paddingHorizontal: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    childContainerRow2: {
        paddingVertical: scale(14),
        // flex: 1,
        flexDirection: 'row',
        paddingHorizontal: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginLeft:10,
        marginRight:10,
        borderColor: colors.lightGray,
    },
    childContainerCol: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderRow: {
        flexDirection: 'row',
        marginVertical: scale(2),
    },
    orderCol: {
        flexDirection: 'column',
        paddingHorizontal: scale(5),
        overflow: 'visible'
    },
    orderSubRow: {
        flexDirection: 'row',
        paddingVertical: scale(1)
    },
    orderImage: {
        height: scale(65),
        width: scale(65),
        backgroundColor: 'gray',
        borderRadius: 4
    },
    itemQty: {
        borderRadius: 3,
        backgroundColor: colors.blue,
        paddingHorizontal: scale(10),
        position: 'absolute',
        top: scale(-10),
        right: scale(-10)
    },
    deleteView: {
        borderRadius: 3,
        backgroundColor: colors.transparent,
        // position: 'absolute',
        // top: scale(-20),
        // right: scale(-20),
        // zIndex: 9999999999
    },
    delete: {
        color: colors.red,
        fontSize: scale(20),
        // marginTop: scale(3)
    },
    qtyText: {
        color: colors.white,
        fontSize: scale(18),
        fontFamily: AppFonts.poppinsBold,
        marginTop: scale(3)
    },
    card: {
        backgroundColor: colors.white,
        height: 'auto',
        width: device.width - scale(25),
        ...Layout.shadow,
        borderRadius: 4,
        padding: scale(15)
    },
    text: {
        fontSize: scale(11),
        color: colors.darkgrey,
        fontFamily: AppFonts.poppinsRegular
    },
    text2: {
        fontSize: scale(14),
        color: colors.blue,
        fontFamily: AppFonts.poppinsRegular
    },
    text3: {
        fontSize: scale(20),
        color: colors.black,
        fontFamily: AppFonts.poppinsRegular
    },
    text4: {
        fontSize: scale(14),
        color: colors.black,
        fontFamily: AppFonts.poppinsMedium
    },
    text5: {
        fontSize: scale(12),
        color: colors.blue,
        fontFamily: AppFonts.poppinsRegular
    },
    textRow: {
        flexDirection: 'row',
        paddingVertical: scale(8)
    },
    textCol: {
        flex: 1,
        flexDirection: 'column'
    },
    textCol2: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    closeBtn: {
        color: colors.white,
        fontSize: scale(20),
    },
    title: {
        color: colors.white,
        fontSize: scale(30),
        fontFamily: AppFonts.AlegreyaBold
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
    modalRow: {
        flex: 1,
        ...Layout.shadow,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalCol: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        height: 'auto',
        padding: scale(15),
        borderRadius: 4
    },
    fieldView: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 4,

    },
    card1: {
        fontSize: scale(20),
        color: colors.black,
        fontFamily: AppFonts.poppinsRegular
    },
    sepatator: {
        height: 2,
        width: "100%",
        backgroundColor: "#CED0CE",
        margin: '1%'
    },
    radioView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    radiobtnMainView: {
        backgroundColor: colors.blue,
        height: scale(20),
        width: scale(20),
        borderRadius: scale(10),
        marginHorizontal: scale(10)
    },
    radiobtnSubView: {
        backgroundColor: colors.lightBlue,
        height: scale(10),
        width: scale(10),
        borderRadius: scale(5),
        margin: scale(5)
    },
    emailField: {
        width: scale(250),
        height: scale(40),
        marginVertical: scale(5),
        borderBottomWidth: 1,
        fontSize: scale(14),
        fontFamily: AppFonts.poppinsMedium
    },
    signinRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(10)
    },
    otherCart: {
        paddingVertical: scale(10),
        marginVertical: scale(4),
        marginHorizontal: scale(4)
    }
});
