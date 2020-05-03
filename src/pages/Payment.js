
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Alert,
    Modal,
    View,
    TouchableOpacity,
} from 'react-native';
import AppColor from '../assets/styles/colors';
import { scale } from '../utils/FontScaler';
import AppImages from '../assets/images';
import AppStyle from '../assets/styles/Layout';
import colors from "../assets/styles/colors";
import ReduxField from "../common/ReduxField";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AppFonts from '../assets/fonts/';
import Layout from '../assets/styles/Layout';
import { reduxForm, reset } from 'redux-form';
import { NavigateChildRoute, NavigateParentRoute, GenerateParam } from '../utils/Global';
import { STRIPE_PUBLISHABLE_KEY } from '../common/Globals';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StripeUtils from "../utils/StripeUtils";
import withLoader from '../redux/Loader/action';
import withLogin from '../redux/Login/action';
import withHome from '../redux/Dashboard/action';

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addUpdateCard: false
        }
        this.cards = [];
    }

    componentDidMount = async () => {
        this._getCards();
    }

    renderSeparator = () => {
        return (
            <View style={paymentStyles.sepatator} />
        );
    };

    selectedOption = (currentScreen) => {
        this.props.selectedOption(currentScreen)
    }

    _toggleModal = (key) => {
        Object.keys(initialValues).map((item, key) => {
            this.props.change(item, '')
        })
        this.setState({
            [key]: !this.state[key]
        });
    }

    _updateProfile = async (formData) => {
        const { setLoader, cardList, setCards } = this.props;
        await setLoader(true);
        this._toggleModal('addUpdateCard');
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`
        }
        const card = GenerateParam({
            'card[number]': formData.cardNumber,
            'card[exp_month]': formData.exp_month,
            'card[exp_year]': formData.exp_year,
            'card[cvc]': formData.cvv,
        });

        const response = await StripeUtils.postData(card, headers, 'tokens');
        console.log('response', response)

        if (response.id) {
            await setCards([formData, ...cardList]);
            await this._getCards();
        } else {
            response.error.message && Alert.alert(response.error.message)
        }
        await setLoader(false);
    }

    _getCards = async () => {
        try {
            const { cardList } = this.props;
            this.cards = [];
            cardList.map((item, key) => {
                this.cards.push(
                    <View key={key} style={{ flex: 1, flexDirection: 'row', paddingVertical: scale(20) }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={paymentStyles.card}>{'**** **** **** ' + item.cardNumber.substr(12, 16)}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                            <AntDesign name='right' style={paymentStyles.arrow} />
                        </View>
                    </View>
                )
                if (key === (cardList.length - 1)) {
                    this.forceUpdate();
                }
            })
        } catch (error) {
            console.log('_getCards', error)
        }
    }

    render() {
        const { addUpdateCard } = this.state;
        const { handleSubmit } = this.props;
        return (
            <View style={paymentStyles.container}>
                <Modal visible={addUpdateCard} animationType={'slide'} transparent={true} >
                    <TouchableOpacity
                        onPress={this._toggleModal.bind(this, 'addUpdateCard')}
                        activeOpacity={1} style={paymentStyles.modalRow}>
                        <TouchableOpacity activeOpacity={1} style={paymentStyles.modalCol}>
                            <View style={paymentStyles.fieldView}>
                                <ReduxField
                                    style={paymentStyles.emailField}
                                    name="cardNumber"
                                    placeholder={'Card Number'}
                                    placeholderTextColor={colors.black}
                                    keyboardType={'number-pad'}
                                    maxLength={16}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <ReduxField
                                            style={[paymentStyles.emailField, { width: scale(50) }]}
                                            name="exp_month"
                                            placeholder={'Month'}
                                            placeholderTextColor={colors.black}
                                            keyboardType={'number-pad'}
                                            maxLength={2}
                                        />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: scale(5) }}>
                                        <ReduxField
                                            style={[paymentStyles.emailField, { width: scale(50) }]}
                                            name="exp_year"
                                            placeholder={'Year'}
                                            placeholderTextColor={colors.black}
                                            keyboardType={'number-pad'}
                                            maxLength={4}
                                        />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: scale(5) }}>
                                        <ReduxField
                                            style={[paymentStyles.emailField, { width: scale(50) }]}
                                            name="cvv"
                                            placeholder={'CVV'}
                                            placeholderTextColor={colors.black}
                                            keyboardType={'number-pad'}
                                            maxLength={3}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>

                            </View>
                            <View style={paymentStyles.signinRow}>
                                <TouchableOpacity
                                    onPress={handleSubmit(this._updateProfile.bind(this))}
                                    style={[AppStyle.blueBtn, { width: '80%', marginTop: scale(10) }]}>
                                    <Text style={AppStyle.blueBtnTxt}>Add Card</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
                <View style={paymentStyles.browseRow}>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: scale(10), paddingRight: scale(10) }}>
                        <TouchableOpacity onPress={this.selectedOption.bind(this, 0)}>
                            <Fontisto name={'close-a'} style={paymentStyles.closeBtn} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={paymentStyles.browseText}>Payment</Text>
                    </View>
                </View>
                <View style={paymentStyles.card1}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={paymentStyles.list}>{'Payment Methods'.toUpperCase()}</Text>
                                    </View>
                                </View>
                                {this.cards}
                            </View>
                        </View>
                        {this.renderSeparator()}
                        <View style={paymentStyles.signinRow}>
                            <TouchableOpacity
                                onPress={this._toggleModal.bind(this, 'addUpdateCard')}
                                style={[AppStyle.blueBtn, { width: '100%' }]}>
                                <Text style={AppStyle.blueBtnTxt}>Add a Credit or Debit Card</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}

const initialValues = {
    'cardNumber': '',
    'exp_month': '',
    'exp_year': '',
    'cvv': ''
}

const validate = values => {
    const error = {};
    if (values.cardNumber === undefined) {
        error.cardNumber = 'Card Number Required';
    }
    if (values.exp_month === undefined) {
        error.exp_month = 'Expire Month Required';
    }
    if (values.exp_year === undefined) {
        error.exp_year = 'Expire Year Required';
    }
    if (values.cvv === undefined) {
        error.cvv = 'CVV Required';
    }
    return error;
};

const withForm = reduxForm({
    form: 'Payment',
    validate,
    initialValues,
    enableReinitialize: true
});

export default withHome(withLogin(withLoader(withForm(Payment))));

const paymentStyles = StyleSheet.create({
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
    card: {
        fontSize: scale(14),
        color: AppColor.black,
        fontFamily: AppFonts.poppinsRegular
    },
    arrow: {
        fontSize: scale(20),
        color: AppColor.gray,
    },
    signinRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(10)
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
    closeBtn: {
        color: colors.white,
        fontSize: scale(20),
    },
    sepatator: {
        height: 2,
        width: "100%",
        backgroundColor: "#CED0CE",
        margin: '1%'
    },
    card1: {
        position: 'absolute',
        top: scale(100),
        padding: scale(20),
        flex: 1,
        flexDirection: 'row',
        ...Layout.shadow,
        backgroundColor: AppColor.white,
        borderRadius: 10,
        marginHorizontal: scale(10)
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
        padding: scale(30),
        borderRadius: 4
    },
    fieldView: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 4,

    },
    emailField: {
        width: scale(250),
        height: scale(40),
        marginVertical: scale(5),
        borderBottomWidth: 1,
        fontSize: scale(14),
        fontFamily: AppFonts.poppinsMedium
    },
})