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
    Alert,
    ImageBackground,
    TouchableOpacity
} from "react-native";
import { Container, Content } from "native-base";
import colors from "../assets/styles/colors";
import { scale } from "../utils/FontScaler";
import { Field, reduxForm } from 'redux-form';
import ReduxField from "../common/ReduxField";
import AppStyle from '../assets/styles/Layout';
import { validateEmail } from '../utils/Validation';
import AppFonts from '../assets/fonts/';
import withLoader from '../redux/Loader/action';
import withLogin from '../redux/Login/action';
import CommonUtils from '../utils/CommonUtils';

const validate = values => {
    const error = {};
    if (values.first_name === undefined) {
        error.first_name = 'First Name Required';
    }
    if (values.last_name === undefined) {
        error.last_name = 'Last Name Required';
    }
    if (values.email === undefined) {
        error.email = 'Email Required';
    } else if (!validateEmail(values.email)) {
        error.email = 'Invalid Email';
    }
    if (values.password === undefined) {
        error.password = 'Password Required';
    }
    return error;
};

const initialValues = {
    first_name: 'test',
    last_name: 'test',
    email: 'test@example.com',
    password: '123456'
}

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }

    _onPress = async (formData) => {
        const { navigation, setLoader } = this.props;
        try {
            await setLoader(true);
            const { email } = formData;
            global.signupFormData = formData;
            const googleResponse = await CommonUtils.postData({ email }, "verify-email");
            console.log('googleResponse', googleResponse);
            if (googleResponse.success) {
                navigation.replace('SignupLocation')
            } else {
                Alert.alert(googleResponse.message);
            }
            await setLoader(false);
        } catch (error) {
            await setLoader(false);
            console.log('_onPress', error)
        }
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <Container>
                <ImageBackground style={{ width: '100%', height: '100%' }}>
                    <Content style={styles.container}>
                        <View style={styles.containerView}>
                            <View style={styles.welcomeView}>
                                <Text style={styles.welcomeText}>Hi, nice to meet you!</Text>
                            </View>
                            <View style={styles.subTextView}>
                                <Text style={styles.subText}>
                                    Enter your details below and we can sign you up in a couple of easy steps.
                                </Text>
                            </View>

                            <View style={styles.fieldView}>
                                <ReduxField
                                    style={styles.emailField}
                                    name="first_name"
                                    placeholder={'Enter your First Name'}
                                    placeholderTextColor={colors.black}
                                />
                            </View>

                            <View style={styles.fieldView2}>
                                <ReduxField
                                    style={styles.emailField}
                                    name="last_name"
                                    placeholder={'Enter your Last Name'}
                                    placeholderTextColor={colors.black}
                                />
                            </View>

                            <View style={styles.fieldView2}>
                                <ReduxField
                                    style={styles.emailField}
                                    name="email"
                                    placeholder={'Enter your email'}
                                    placeholderTextColor={colors.black}
                                />
                            </View>
                            <View style={styles.fieldView2}>
                                <ReduxField
                                    style={styles.emailField}
                                    name="password"
                                    placeholder={'Enter your password'}
                                    placeholderTextColor={colors.black}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View style={styles.signinRow}>
                                <TouchableOpacity
                                    onPress={handleSubmit(this._onPress.bind(this))}
                                    style={AppStyle.blueBtn}>
                                    <Text style={AppStyle.blueBtnTxt}>Next</Text>
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
        flexDirection: 'row',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: scale(25),
        fontFamily: AppFonts.AlegreyaBold
    },
    subTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(10)
    },
    subText: {
        fontSize: scale(14),
        textAlign: 'center',
        width: '65%',
        fontFamily: AppFonts.poppinsRegular
    },
    fieldView: {
        marginTop: scale(20),
        flexDirection: 'column',
        alignItems: 'center'
    },
    fieldView2: {
        marginTop: scale(20),
        flexDirection: 'column',
        alignItems: 'center'
    },
    emailField: {
        width: scale(250),
        height: scale(40),
        borderBottomWidth: 1,
        fontSize: scale(14),
        fontFamily: AppFonts.poppinsRegular
    },
    signinRow: {
        flexDirection: 'row',
        marginVertical: scale(30)
    },
    signInBtn: {
        backgroundColor: colors.blue,
        width: '80%',
        height: scale(35),
        justifyContent: 'center',
        borderRadius: 4,
        alignItems: 'center'
    },
    forgotRow: {
        flexDirection: 'row',
        marginTop: scale(10)
    },
    signupRow: {
        flexDirection: 'row',
        marginTop: scale(80)
    },
});

const withForm = reduxForm({
    form: 'ForgotPassword',
    validate,
    initialValues: __DEV__ ? initialValues : {}
});

export default withLogin(withLoader(withForm(Signup)));
