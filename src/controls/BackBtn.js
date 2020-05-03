
import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from "../assets/styles/colors";
import { scale } from '../utils/FontScaler';
import AppFonts from '../assets/fonts/';

class BackBtn extends Component {
    constructor(props) {
        super(props);
        global.loadViewCartBtn = true;
    }
    render() {
        const { customeIconStyle = {}, customeTextStyle = {} } = this.props;
        return (
            <TouchableOpacity onPress={() => { this.props.onPress && this.props.onPress() }}>
                <AntDesign style={[styles.leftIcon, customeIconStyle]} name={'left'}>
                    <Text style={[styles.leftText, customeTextStyle]} >{'Back'}</Text>
                </AntDesign>
            </TouchableOpacity>
        )
    }
}

export default BackBtn;

const styles = StyleSheet.create({
    leftIcon: {
        color: colors.white,
        fontSize: scale(16)
    },
    leftText: {
        fontFamily: AppFonts.poppinsRegular,
        fontSize: scale(16),
        color: colors.white,
    }
});
