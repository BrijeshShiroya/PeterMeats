
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { scale } from '../utils/FontScaler';
import colors from "../assets/styles/colors";

class PlusMinus extends Component {
    constructor(props) {
        super(props);
        this.value = props.setValue;
    }

    _onPress = (click) => {
        const { maxValue } = this.props;
        if (click) {
            if (this.value >= maxValue) {
                return
            }
            this.value += 1;
        } else {
            if (this.value > 1) {
                this.value -= 1;
            } else {
                this.value = 1;
            }
        }
        this.props.getValue(this.value);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={1} onPress={this._onPress.bind(this, false)} style={styles.mainView}>
                    <View style={{ flexDirection: 'column' }}>
                        <Entypo name={"minus"} style={{ fontSize: scale(24), color: colors.blue }} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={this._onPress.bind(this, true)} style={styles.mainView2}>
                    <View style={{ flexDirection: 'column' }}>
                        <Entypo name={"plus"} style={{ fontSize: scale(24), color: colors.white }} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

export default PlusMinus;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.blue,
        overflow: 'hidden'
    },
    mainView: {
        paddingVertical: scale(2),
        flexDirection: 'row',
        paddingHorizontal: scale(15),
        backgroundColor: colors.white
    },
    mainView2: {
        paddingVertical: scale(2),
        flexDirection: 'row',
        paddingHorizontal: scale(15),
        backgroundColor: colors.blue
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
