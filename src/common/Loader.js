import React, { Component } from "react";
import {
    Text,
    View,
    Modal,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import colors from "../assets/styles/colors";
import { scale } from "../utils/FontScaler";
import withLoader from '../redux/Loader/action';
import AppFonts from '../assets/fonts/';
import AppColor from '../assets/styles/colors';

class Loader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { isLoader } = this.props;
        return (
            <Modal visible={isLoader} transparent={true} animationType='slide' >
                <View style={styles.mainView}>
                    <View style={styles.subView}>
                        <View style={{ flexDirection: 'row', paddingBottom: scale(10) }}>
                            <ActivityIndicator size={30} color={AppColor.blue} />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{
                                fontFamily: AppFonts.poppinsMedium
                            }}>
                                Please wait...
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default withLoader(Loader);


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    subView: {
        backgroundColor: colors.white,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: scale(110),
        width: scale(110)

    }
})