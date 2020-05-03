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
    ImageBackground,
    TouchableOpacity,
    Alert,
    Keyboard
} from "react-native";
import { Container, Content } from "native-base";
import colors from "../assets/styles/colors";
import { scale } from "../utils/FontScaler";
import { reduxForm } from 'redux-form';
import ReduxField from "../common/ReduxField";
import AppImages from '../assets/images';
import AppStyle from '../assets/styles/Layout';
import withLoader from '../redux/Loader/action';
import withLogin from '../redux/Login/action';
import { validateEmail } from '../utils/Validation';
import AppFonts from '../assets/fonts/';

const validate = values => {
    const error = {};
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

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            keyboardOpen: false
        }
    }

    componentDidMount = () => {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            keyboardOpen: true
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardOpen: false
        })
    }


    _doLogin = async (formData) => {
        console.log('formData', formData);
        const { setLoader, doLogin, loginData, navigation } = this.props;
        await setLoader(true);
        const response = await doLogin(formData);
        await setLoader(false);
        console.log('rep', response)
        setTimeout(() => {
            if (response.success) {
                navigation.replace('Dashboard')
            } else {
                Alert.alert('Peter Timbs', 'Invalid email or password.')
            }
        }, 500)

    }

    _onSignup = () => {
        const { navigation } = this.props;
        navigation.replace('SignupLocation')
    }

    render() {
        const { handleSubmit, navigation } = this.props;
        const { keyboardOpen } = this.state;

        return (
            <Container>
                <ImageBackground source={AppImages.bg} style={{ width: '100%', height: '100%' }}>
                    <Content style={styles.container}>
                        <View style={styles.containerView}>
                            <View style={styles.welcomeView}>
                                <Text style={styles.welcomeText}>Welcome</Text>
                            </View>
                            <View style={styles.subTextView}>
                                <Text style={styles.subText}>Sign in to continue</Text>
                            </View>
                            <View style={styles.fieldView}>
                                <ReduxField
                                    style={styles.emailField}
                                    name="email"
                                    placeholder={'Email'}
                                    placeholderTextColor={colors.black}
                                />
                                <ReduxField
                                    style={styles.emailField}
                                    name="password"
                                    placeholder={'Password'}
                                    secureTextEntry={true}
                                    placeholderTextColor={colors.black}
                                />
                            </View>
                            <View style={styles.signinRow}>
                                <TouchableOpacity
                                    onPress={handleSubmit(this._doLogin.bind(this))}
                                    style={AppStyle.blueBtn}>
                                    <Text style={AppStyle.blueBtnTxt}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.forgotRow}>
                                <TouchableOpacity onPress={() => {
                                    navigation.replace('ForgotPassword')
                                }}>
                                    <Text style={styles.forgotBtnText}>Forgot your Password?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Content>
                    {
                        !keyboardOpen
                            ?
                            <View style={styles.signupRow}>
                                <TouchableOpacity onPress={this._onSignup.bind(this)}>
                                    <Text style={styles.signupBtnText}>Don't have an account? Sign up</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                    }

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
        alignItems: 'center',
    },
    welcomeView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: scale(36),
        fontFamily: AppFonts.AlegreyaBold
    },
    subTextView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    subText: {
        fontSize: scale(14),
        fontFamily: AppFonts.poppinsMedium
    },
    fieldView: {
        marginTop: scale(100),
        flexDirection: 'column',
        alignItems: 'center'
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
        marginTop: scale(55),
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
        fontSize: scale(14),
        fontFamily: AppFonts.poppinsMedium

    },
    signupRow: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(20)

    },
    signupBtnText: {
        color: colors.black,
        fontSize: scale(14),
        fontFamily: AppFonts.poppinsMedium

    },
});

const withForm = reduxForm({
    form: 'Login',
    initialValues: {
        'email': __DEV__ ? 'api@example.com' : "",
        'password': __DEV__ ? 'admin' : ""
    },
    validate
});

export default withLogin(withLoader(withForm(Login)));
