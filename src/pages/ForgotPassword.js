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

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }

    _onPress = async (formData) => {
        console.log('formData', formData);
        const { setLoader, forgotPassword, navigation } = this.props;
        try {
            await setLoader(true);
            const response = await forgotPassword(formData);
            await setLoader(false);
            console.log('rep', response)
            setTimeout(() => {
                Alert.alert('Peter Timbs', response.message)
            }, 1000)
        } catch (error) {
            console.log('_onPress', error)
            await setLoader(false);
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
                                <Text style={styles.welcomeText}>Forgot password?</Text>
                            </View>
                            <View style={styles.subTextView}>
                                <Text style={styles.subText}>
                                    Enter your email address below and we'll email you instructions on how to change your password
                                </Text>
                            </View>
                            <View style={styles.fieldView}>
                                <ReduxField
                                    style={styles.emailField}
                                    name="email"
                                    placeholder={'Enter your email'}
                                    placeholderTextColor={colors.black}
                                />
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
        marginTop: scale(80),
        flexDirection: 'column',
        alignItems: 'center'
    },
    emailField: {
        width: scale(250),
        height: scale(40),
        marginVertical: scale(5),
        borderBottomWidth: 1,
        fontSize: scale(14),
        fontFamily: AppFonts.poppinsRegular
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
    validate
});

export default withLogin(withLoader(withForm(ForgotPassword)));
