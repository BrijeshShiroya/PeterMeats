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
import Ionicons from 'react-native-vector-icons/Ionicons';
import withHome from '../redux/Dashboard/action';

class SignupLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
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

    _onPress = async () => {
        const { navigation, userLocation } = this.props;
        if (userLocation && userLocation.description) {
            navigation.replace('MobileNumber');
        } else {
            Alert.alert('Please Add Location');
        }
    }

    renderGooglePlaceAutocomplete = () => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <ReduxField
                    style={styles.emailField}
                    name="currentLocation"
                    placeholder={'Current Location'}
                    placeholderTextColor={colors.black}
                />
            </View>
        )
    }

    render() {
        const { handleSubmit, navigation } = this.props;
        return (
            <Container>
                <ImageBackground style={{ width: '100%', height: '100%' }}>
                    <Content style={styles.container}>
                        <View style={styles.containerView}>
                            <View style={styles.welcomeView}>
                                <Text style={styles.welcomeText}>Set your address</Text>
                            </View>
                            <View style={styles.subTextView}>
                                <Text style={styles.subText}>
                                    Set your delivery location to determine if your order can be delivered or if they need to be picked up in store..
                                </Text>
                            </View>
                            <View style={styles.subRow}>
                                {
                                    this.renderGooglePlaceAutocomplete()
                                }
                            </View>
                            <View style={styles.signinRow}>
                                <TouchableOpacity
                                    onPress={() => {
                                        global.mapBtnEvent = 1;
                                        navigation.replace('SignupMap')
                                    }}
                                    style={AppStyle.whiteBtn}>
                                    <Ionicons style={AppStyle.whiteBtnTxt} name={'ios-send'}>
                                        <Text style={AppStyle.whiteBtnTxt}> Use Current Location</Text>
                                    </Ionicons>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.forgotRow}>
                                <TouchableOpacity
                                    style={{
                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => {
                                        global.mapBtnEvent = 0;
                                        navigation.replace('SignupMap')
                                    }}>
                                    <Text style={styles.forgotBtnText}>Select It Manually.</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.signinRow}>
                                <TouchableOpacity
                                    onPress={this._onPress.bind(this)}
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
        marginTop: scale(80),
        flexDirection: 'column',
        alignItems: 'center'
    },
    fieldView2: {
        marginTop: scale(20),
        flexDirection: 'column',
        alignItems: 'center'
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
        marginTop: scale(20)
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
        marginTop: scale(20)
    },
    signupRow: {
        flexDirection: 'row',
        marginTop: scale(80)
    },
    subRow: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginVertical: scale(15),
        justifyContent: 'center'
    }
});

const withForm = reduxForm({
    form: 'ForgotPassword',
});

export default withHome(withLogin(withLoader(withForm(SignupLocation))));
