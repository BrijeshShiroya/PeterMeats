
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
import { Rating, AirbnbRating } from 'react-native-ratings';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppFonts from '../assets/fonts/';

export default class ExtraLargeCard extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        const { name, image, ratings, serving_size, cook_time, difficulty } = this.props;
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
                    width: scale(320),
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
                                    width: scale(320),
                                    resizeMode: 'cover'
                                }}>
                            </Image>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.title}>{name.length > 32 ? name.substr(0, scale(32)) + '...' : name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View style={styles.textView} pointerEvents={'none'}>
                                <Rating
                                    startingValue={ratings}
                                    ratingCount={5}
                                    imageSize={15}
                                    style={{ paddingVertical: 10 }}
                                    isDisabled={true}
                                />
                            </View>
                            <View style={styles.textView}>
                                <Entypo name={'users'} style={styles.subText} size={scale(12)}  >
                                    <Text style={styles.subText}>{' ' + serving_size}</Text>
                                </Entypo>
                            </View>
                            <View style={styles.textView}>
                                <Feather name={'clock'} style={styles.subText} size={scale(13)}  >
                                    <Text style={styles.subText}>{' ' + cook_time}</Text>
                                </Feather>
                            </View>
                            <View style={styles.textView}>
                                <MaterialCommunityIcons style={styles.subText} name={'fire'} size={scale(15)} />
                                <Text style={styles.subText}>{difficulty}</Text>
                            </View>
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
        paddingHorizontal: scale(7),
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        fontSize: scale(14),
        // fontWeight: 'bold',
        fontFamily: AppFonts.poppinsMedium
    },
    subText: {
        fontSize: scale(14),
        color: AppColors.gray,
        fontFamily: AppFonts.poppinsMedium
    }
});
