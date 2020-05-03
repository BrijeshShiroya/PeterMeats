
/*
 * @Name - StyleConfig.js
 * @purpose - To provide application level generalised fonts and UI scaling
 * @params - NA
 *
 */

import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const fontSizes = {
    fontSize1: scale(50),
    fontSize2: scale(45),
    fontSize3: scale(40),
    fontSize4: scale(35),
    fontSize4_5:scale(32),
    fontSize5: scale(30),
    fontSize6_5: scale(27),
    fontSize6: scale(25),
    fontSize7: scale(23),
    fontSize8: scale(21),
    fontSize9: scale(20),
    fontSize10: scale(18),
    fontSize11: scale(16),
    fontSize12: scale(14)
}

export { scale, verticalScale, moderateScale, fontSizes };