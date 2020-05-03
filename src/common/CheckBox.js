
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale } from '../utils/FontScaler';
import colors from "../assets/styles/colors";
import AppFonts from '../assets/fonts/';

class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: props.value
        }
    }

    _toggleBtn = () => {
        this.setState({
            checkbox: !this.state.checkbox
        }, () => {
            this.props.getValue && this.props.getValue(this.state.checkbox);
        });
    }

    render() {
        const { checkbox } = this.state;
        const { text } = this.props;
        return (
            <TouchableOpacity onPress={this._toggleBtn.bind(this)} style={styles.mainView}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.textView}>
                        <Text style={{ fontFamily: AppFonts.poppinsRegular, fontSize: scale(16), color: (checkbox) ? colors.blue : colors.black }}>{text}</Text>
                    </View>
                    <View style={styles.iconView}>
                        {
                            checkbox
                                ? <Ionicons name={"md-checkmark"} style={{ fontSize: scale(20), color: colors.blue }} />
                                : null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

}

export default CheckBox;

const styles = StyleSheet.create({
    mainView: {
        paddingVertical: scale(7),
        height: 'auto',
        flexDirection: 'row',
        paddingHorizontal: scale(15),
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray
    },
    textView: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    iconView: {
        flex: 1,
        flexDirection: 'column',
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    }
});
