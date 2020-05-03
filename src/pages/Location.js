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
    TouchableOpacity
} from "react-native";
import { Container, Content } from "native-base";
import colors from "../assets/styles/colors";
import { scale } from "../utils/FontScaler";
import { Field, reduxForm } from 'redux-form';
import ReduxField from "../common/ReduxField";
import AppImages from '../assets/images';
import AppStyle from '../assets/styles/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Location extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { navigation } = this.props;
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
                                    Set your delivery location to determine if your orders can be delivered or if they need to be picked up in store.
                                </Text>
                            </View>
                            <View style={styles.signinRow}>
                                <TouchableOpacity
                                    onPress={() => { }}
                                    style={AppStyle.whiteBtn}>
                                    <Ionicons style={styles.leftText} name={'ios-send'}>
                                        <Text style={AppStyle.whiteBtnTxt}> Use current location</Text>
                                    </Ionicons>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.forgotRow}>
                                <TouchableOpacity
                                    style={{
                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => {
                                        navigation.replace('ForgotPassword')
                                    }}>
                                    <Text style={styles.forgotBtnText}>Select it manually.</Text>
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
        width: scale(250),
        height: scale(40),
        marginVertical: scale(5),
        borderBottomWidth: 1,
        fontSize: scale(14)
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
    leftText: {
        color: colors.blue,
        fontSize: scale(16)
    },
});

export default Location;
