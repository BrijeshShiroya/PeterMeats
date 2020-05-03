/*
 * @Name - CardView.js
 * @purpose - common CardView component
 * @params - NA
 *
 */
import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import AppColors from "../assets/styles/colors";
import { scale } from "../utils/FontScaler";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Layout from '../assets/styles/Layout';
import AppFonts from '../assets/fonts/';

class CardView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type = "products" } = this.props;
    if (type == "products") {
      const { image, title, price, disc } = this.props;
      return (
        <View style={styles.cardContainerStyle}>
          <View style={{ flexDirection: 'column', padding: scale(5) }}>
            <Image source={image} style={{ height: scale(80), width: scale(80) }} />
          </View>
          <View style={{ flexDirection: 'column', flex: 1, }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Text numberOfLines={1} style={styles.title}>
                {title.length > 30 ? title.substr(0, 30) + '...' : title}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.price}>
                {price}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.disc} numberOfLines={2}>
                {disc}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    if (type == "recipes") {
      const { name, image, ratings, servings, cook_time, difficulty } = this.props;
      return (
        <View style={styles.cardContainerStyle}>
          <View style={{ flexDirection: 'column', padding: scale(10) }}>
            <Image source={image} style={{ height: scale(70), width: scale(70) }} />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text numberOfLines={1} style={styles.title}>
                {name.length > 32 ? name.substr(0, 32) + '...' : name}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flexDirection: 'column' }}>
                    <View style={styles.textView}>
                      <Rating
                        startingValue={ratings}
                        ratingCount={5}
                        imageSize={15}
                        isDisabled={true}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.textView}>
                      <Entypo name={'users'} style={styles.subIcon} />
                      <Text style={styles.subText}>{' ' + servings}</Text>
                    </View>
                  </View>

                </View>
                <View style={{ flexDirection: 'row' }}>

                  <View style={{ flexDirection: 'column' }}>
                    <View style={styles.textView}>
                      <Feather name={'clock'} style={styles.subIcon} />
                      <Text style={styles.subText}>{' ' + cook_time}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'column' }}>
                    <View style={styles.textView}>
                      <MaterialCommunityIcons style={styles.subIcon} name={'fire'} />
                      <Text style={styles.subText}>{difficulty}</Text>
                    </View>
                  </View>

                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
}

/*
 * @purpose - Common  style
 * @params - NA
 *
 */
const styles = StyleSheet.create({
  cardContainerStyle: {
    backgroundColor: AppColors.white,
    margin: scale(10),
    alignItems: "center",
    flexDirection: "row",
    elevation: 5,
    flex: 1,
    borderRadius: 4,
    ...Layout.shadow,
    paddingVertical: scale(5)
  },
  title: {
    flex: 1,
    fontSize: scale(14),
    // fontWeight: 'bold',
    fontFamily: AppFonts.poppinsSemiBold
  },
  price: {
    fontSize: scale(14),
    // fontWeight: 'bold',
    color: AppColors.blue,
    fontFamily: AppFonts.poppinsSemiBold
  },
  disc: {
    fontSize: scale(12),
    color: AppColors.gray,
    flexWrap: 'wrap',
    flex: 1,
    fontFamily: AppFonts.poppinsRegular
  },
  textView: {
    flexDirection: 'row',
    paddingVertical: scale(5),
    paddingHorizontal: scale(7),
    justifyContent: 'center',
    alignItems: 'center'
  },
  subIcon: {
    fontSize: scale(14),
    color: AppColors.darkgrey,
    fontFamily: AppFonts.poppinsMedium,
    marginBottom: scale(5)
  },
  subText: {
    fontSize: scale(12),
    color: AppColors.gray,
    fontFamily: AppFonts.poppinsMedium,
  }
});

export default CardView;
