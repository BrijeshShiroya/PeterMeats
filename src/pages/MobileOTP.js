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
    Alert,
    Modal
} from "react-native";
import { Container, Content } from "native-base";
import colors from "../assets/styles/colors";
import { scale } from "../utils/FontScaler";
import { Field, reduxForm } from 'redux-form';
import ReduxField from "../common/ReduxField";
import AppImages from '../assets/images';
import AppStyle from '../assets/styles/Layout';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import withLoader from '../redux/Loader/action';
import withLogin from '../redux/Login/action';
import withHome from '../redux/Dashboard/action';

const validate = values => {
    const error = {};
    if (values.mobile === undefined) {
        error.mobile = 'Mobile Required';
    }
    return error;
};

class MobileOTP extends Component {
    constructor(props) {
        super(props);
        this.otp = '';
    }

    _onPress = async () => {
        const { setLoader, verifyOTP, navigation, userLocation } = this.props;
        try {
            await setLoader(true);
            const { otp } = this;
            const { email, phone } = global.signupFormData;
            const response = await verifyOTP({ email, phone, otp, ...userLocation.locationobj });
            const responseSingup = await CommonUtils.postData(global.signupFormData, "singup");
            await setLoader(false);
            console.log('rep', response);
            console.log('responseSingup', responseSingup);
            if (response.success) {
                navigation.replace('Login');
            }
            setTimeout(() => {
                Alert.alert('Peter Timbs', response.message)
            }, 1000)

        } catch (error) {
            console.log('_onPress', error)
            await setLoader(false);
        }
    }

    render() {
        return (
            <Container>
                <ImageBackground style={{ width: '100%', height: '100%' }}>
                    <Content style={styles.container}>
                        <View style={styles.containerView}>
                            <View style={styles.welcomeView}>
                                <Text style={styles.welcomeText}>Verify your number</Text>
                            </View>
                            <View style={styles.subTextView}>
                                <Text style={styles.subText}>
                                    Enter the code sent to your mobile and then are ready to go!
                                </Text>
                            </View>
                            <View style={styles.signinRow}>
                                <OTPInputView
                                    style={{ width: '80%', height: scale(100) }}
                                    pinCount={4}
                                    code={this.otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                    onCodeChanged={code => {
                                        console.log('code', code)
                                        this.otp = code;
                                        this.forceUpdate();
                                    }}
                                    autoFocusOnLoad={true}
                                    codeInputFieldStyle={styles.underlineStyleBase}
                                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                    onCodeFilled={(code => {
                                        // this.otp = code;
                                        console.log(`Code is ${code}, you are good to go!`)
                                    })}
                                />
                            </View>
                            <View style={styles.signinRow}>
                                <TouchableOpacity
                                    onPress={this._onPress.bind(this)}
                                    style={AppStyle.blueBtn}>
                                    <Text style={AppStyle.blueBtnTxt}>Verify now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Content>
                </ImageBackground>
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
    underlineStyleBase: {
        width: scale(30),
        height: scale(45),
        borderWidth: 0,
        borderBottomWidth: 1,
        fontSize: scale(14)
    },
    underlineStyleHighLighted: {
        borderColor: colors.black,
    },
});

const withForm = reduxForm({
    form: 'MobileOTP',
    validate
});

export default withHome(withLogin(withLoader(withForm(MobileOTP))));
