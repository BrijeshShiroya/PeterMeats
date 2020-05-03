/*
 * @Name - SignUp.js
 * @purpose - SignUp component to register new user
 * @params - NA
 *
 */
import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Modal,
    Alert
} from "react-native";
import { Container, Content } from "native-base";
import colors from "../assets/styles/colors";
import { scale } from "../utils/FontScaler";
import { Field, reduxForm } from 'redux-form';
import ReduxField from "../common/ReduxField";
import AppImages from '../assets/images';
import AppStyle from '../assets/styles/Layout';
import PhoneInput from 'react-native-phone-input';
import withLoader from '../redux/Loader/action';
import withLogin from '../redux/Login/action';

const validate = values => {
    const error = {};
    if (values.mobile === undefined) {
        error.mobile = 'Mobile Required';
    }
    return error;
};

class MobileNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countryList: [
                {
                    key: 151,
                    image: 175,
                    label: "New Zealand",
                    dialCode: "+64",
                    iso2: "nz",
                }
            ],
            countryModal: false
        }
    }

    _onPress = async (formData) => {
        console.log('formData', formData)
        const { setLoader, navigation } = this.props;
        try {
            await setLoader(true);
            const { phone } = formData;
            global.signupFormData = { ...global.signupFormData, phone };
            const response = await CommonUtils.postData({ phone }, "send-otp");
            console.log('response', response);
            if (response.success) {
                navigation.replace('MobileOTP')
            } else {
                Alert.alert(response.message);
            }
            await setLoader(false);
        } catch (error) {
            await setLoader(false);
            console.log('_onPress', error)
        }
    }

    render() {
        const { navigation, handleSubmit } = this.props;
        const { countryList, countryModal } = this.state;
        return (
            <Container>
                <ImageBackground style={{ width: '100%', height: '100%' }}>
                    <Content style={styles.container}>
                        <View style={styles.containerView}>
                            <View style={styles.welcomeView}>
                                <Text style={styles.welcomeText}>Enter your mobile</Text>
                            </View>
                            <View style={styles.subTextView}>
                                <Text style={styles.subText}>
                                    To get started all you need to do is enter your mobile number below
                                </Text>
                            </View>
                            <View style={styles.signinRow}>
                                <View style={styles.countryField}>
                                    <View style={{
                                        flexDirection: 'column',
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <PhoneInput
                                            ref={(ref) => this.phone = ref}
                                            initialCountry={'nz'}
                                            onPressFlag={() => {
                                                // this.setState({
                                                //     countryModal: true
                                                // })
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        flexDirection: 'column',
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ fontSize: scale(14) }}>{this.dialCode}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'column',
                                        flex: 5
                                    }}>
                                        <ReduxField
                                            style={styles.emailField}
                                            name="phone"
                                            placeholder={''}
                                            placeholderTextColor={colors.black}
                                            keyboardType={'numeric'}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.signinRow}>
                                <TouchableOpacity
                                    onPress={handleSubmit(this._onPress.bind(this))}
                                    style={AppStyle.blueBtn}>
                                    <Text style={AppStyle.blueBtnTxt}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Content>
                </ImageBackground>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={countryModal}
                    onRequestClose={() => { }}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={countryList}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity key={index} onPress={() => {
                                    this.phone.selectCountry(item.iso2);
                                    this.dialCode = item.dialCode;
                                    this.setState({
                                        countryModal: false
                                    })
                                }}>
                                    <View key={index} style={{
                                        flexDirection: 'row',
                                        padding: scale(5)
                                    }}>
                                        <Image source={item.image} style={{ height: scale(20), width: scale(30) }} />
                                        <Text style={{ paddingLeft: scale(5) }}>{item.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.id}
                        />
                    </View>
                </Modal>
            </Container>
        );
    }
}

/*
 * @purpose - Common  style
 * @params - NA
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerView: {
        marginTop: scale(44),
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeView: {
        marginTop: scale(66),
        flexDirection: 'row',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: scale(25)
    },
    subTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(10)
    },
    subText: {
        fontSize: scale(14),
        textAlign: 'center',
        width: '65%'
    },
    fieldView: {
        marginTop: scale(80),
        flexDirection: 'column',
        alignItems: 'center'
    },
    emailField: {
        width: "100%",
        height: scale(36),
        marginVertical: scale(5),
        fontSize: scale(14),
    },
    countryField: {
        flexDirection: 'row',
        backgroundColor: colors.gray,
        borderRadius: 5,
        width: '80%',
        paddingHorizontal: scale(5),
    },
    signinRow: {
        flexDirection: 'row',
        marginTop: scale(55)
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
    forgotRow: {
        flexDirection: 'row',
        marginTop: scale(10)
    },
    forgotBtnText: {
        color: colors.black,
        fontSize: scale(14)
    },
    signupRow: {
        flexDirection: 'row',
        marginTop: scale(80)
    },
    signupBtnText: {
        color: colors.lightGray,
        fontSize: scale(14)
    },
});

const withForm = reduxForm({
    form: 'MobileNumber',
    validate
});

export default withLogin(withLoader(withForm(MobileNumber)));
