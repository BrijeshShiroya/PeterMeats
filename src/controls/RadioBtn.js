
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from "../assets/styles/colors";
import { scale } from '../utils/FontScaler';
import AppFonts from '../assets/fonts/';

class RadioBtn extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        let { selected, data } = this.props;
        let selectedItem = {};
        data.map((item, key) => {
            if (item.key == selected.key) {
                data[key]['selected'] = true;
                selectedItem = data[key];
            } else {
                data[key]['selected'] = false;
            }
            if (key == (data.length - 1)) {
                this.props.onRadioClick(data, selectedItem);
            }
        })
    }

    render() {
        const { children, selected } = this.props;
        return (
            <TouchableOpacity activeOpacity={1} style={styles.radioView} onPress={this._onPress}>
                <View style={styles.radioView}>
                    <View style={styles.radiobtnMainView}>
                        <View style={selected.selected ? styles.radiobtnSubView : {}} />
                    </View>
                    {children}
                </View>
            </TouchableOpacity>
        )
    }
}

export default RadioBtn;

const styles = StyleSheet.create({
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
    }
});
