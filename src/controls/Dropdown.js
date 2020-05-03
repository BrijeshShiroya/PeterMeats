
import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AppFonts from '../assets/fonts';
import { scale } from '../utils/FontScaler';
import AppColor from "../assets/styles/colors";
import Layout from '../assets/styles/Layout';

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            selectedValue: '',
            showModal: false
        }
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={this.onChangeText.bind(this, item.value, index, item)}>
                <View key={index} style={styles.optionItem}>
                    <Text style={styles.listItem}>{item.value}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _toggleModal = (selectedValue = this.state.selectedValue) => {
        this.setState({
            showModal: !this.state.showModal,
            selectedValue
        })
    }

    onChangeText = (value, index, item) => {
        try {
            this.props.onChangeText(value, index, item);
        } catch (error) {

        }
        this._toggleModal(item);
    }

    render() {
        const { showModal, selectedValue } = this.state;
        const { options } = this.props;
        return (
            <TouchableOpacity activeOpacity={1} onPress={this._toggleModal.bind(this)}>
                <View style={styles.mainView}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.listItem}>{selectedValue.value}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Entypo name='chevron-thin-down' style={styles.dropdownArrow} />
                    </View>
                    <Modal animationType={'slide'} visible={showModal} transparent={true}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={this._toggleModal.bind(this)}>
                            <View style={styles.modalView}>
                                <FlatList
                                    style={{
                                        ...Layout.shadow,
                                        backgroundColor: AppColor.transparent,
                                    }}
                                    data={options}
                                    renderItem={this.renderItem}
                                    bounces={false}
                                    alwaysBounceVertical={false}
                                    alwaysBounceHorizontal={false}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </TouchableOpacity>
        )
    }
}

export default Dropdown;

const styles = StyleSheet.create({
    card: {
        fontSize: scale(14),
        color: AppColor.gray,
        fontFamily: AppFonts.poppinsRegular
    },
    listItem: {
        fontSize: scale(14),
        color: AppColor.black,
        fontFamily: AppFonts.poppinsRegular
    },
    dropdownArrow: {
        fontSize: scale(20),
        color: AppColor.blue,
    },
    modalView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: scale(20)
    },
    optionItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: scale(8),
        borderBottomWidth: 1,
        borderBottomColor: AppColor.lightGray,
        backgroundColor: AppColor.white
    },
    mainView: {
        ...Layout.shadow,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: AppColor.white,
        padding: scale(7),
        borderRadius: 4,
        margin: scale(5)
    },
})
