// App Styles

import AppColors from "./colors";
import { scale } from "../../utils/FontScaler";
import AppFonts from '../fonts';

export default Layout = {
    blueBtn: {
        backgroundColor: AppColors.blue,
        width: '80%',
        height: scale(40),
        justifyContent: 'center',
        borderRadius: 4,
        alignItems: 'center'
    },
    darkBlueBtn: {
        backgroundColor: AppColors.darkBlue,
        width: '80%',
        height: scale(40),
        justifyContent: 'center',
        borderRadius: 30,
        alignItems: 'center'
    },
    blueBtnTxt: {
        color: AppColors.white,
        fontSize: scale(15),
        fontFamily: AppFonts.poppinsMedium
    },
    whiteBtn: {
        borderWidth: 1,
        borderColor: AppColors.blue,
        backgroundColor: AppColors.white,
        width: '80%',
        height: scale(35),
        justifyContent: 'center',
        borderRadius: 4,
        alignItems: 'center'
    },
    whiteBtnTxt: {
        color: AppColors.blue,
        fontSize: scale(16)
    },
    shadow: {
        borderBottomWidth: 0,
        shadowColor: AppColors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 7,
        elevation: 5
    },
    commonBtn: {
        backgroundColor: AppColors.blue,
        width: '100%',
        paddingVertical: scale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    commonBtnText: {
        alignItems: 'center',
        fontSize: scale(18),
        color: AppColors.white,
        fontFamily: AppFonts.poppinsMedium
    },
    tabShadow: {
        borderBottomWidth: 0,
        shadowColor: AppColors.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 10
    }
};