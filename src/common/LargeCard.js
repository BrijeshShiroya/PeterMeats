
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    StatusBar,
    View,
    Image
} from 'react-native';
import AppColors from '../assets/styles/colors';
import { scale } from '../utils/FontScaler';
import Layout from '../assets/styles/Layout';
import AppFonts from '../assets/fonts/';

export default class LargeCard extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        const { name, image, price } = this.props;
        return (
            <View style={{
                ...Layout.shadow,
                // overflow: 'hidden'
            }}>

                <View style={{
                    flexDirection: 'row',
                    borderRadius: 4,
                    overflow: 'hidden',
                    backgroundColor: AppColors.white,
                    width: scale(200),
                }}>
                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <Image
                                source={{ uri: image }}
                                style={{
                                    height: scale(100),
                                    width: scale(200),
                                    resizeMode: 'cover'
                                }}>
                            </Image>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.title}>{name.length > 18 ? name.substr(0, scale(18)) + '...' : name}</Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.price}>{price}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textView: {
        flexDirection: 'row',
        paddingVertical: scale(5),
        paddingHorizontal: scale(7)
    },
    title: {
        fontSize: scale(14),
        // fontWeight: 'bold',
        fontFamily: AppFonts.poppinsMedium
    },
    price: {
        fontSize: scale(14),
        color: AppColors.blue,
        fontFamily: AppFonts.poppinsMedium
    },
});
