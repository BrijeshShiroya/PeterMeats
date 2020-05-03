
import React, { Component } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    Image
} from 'react-native';
import AppColors from '../assets/styles/colors';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale } from '../utils/FontScaler';
import withDashboard from '../redux/Dashboard/action';
import withLogin from '../redux/Login/action';
import withLoader from '../redux/Loader/action';
import Layout from '../assets/styles/Layout';
import CheckBox from '../common/CheckBox';
import { Dropdown } from 'react-native-material-dropdown';
import { reduxForm } from 'redux-form';
import ReduxField from "../common/ReduxField";
import AppFonts from '../assets/fonts/';

let self;
let data = [{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}];
class FilterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterItems: [],
        }
        self = this;
        this.bodyData = {};
        this.loadingPage = false;
        this.freeFrom = [];
    }

    _closeModal = () => {
        const { showFilterModal } = this.props;
        showFilterModal(false);
    }

    componentDidMount = async () => {
        const { tabName, getFilterByTab, loginData, setLoader } = this.props;
        this.loadingPage = true;
        this.forceUpdate();
        const params = `oauth_token=${loginData.data._token}`;
        const response = await getFilterByTab(params, tabName + '/filters');
        console.log('response', response)
        if (response.success) {
            const { success, ...restData } = response;
            this.loadingPage = false;

            this.setState({
                filterItems: restData.filters
            });
        }
    }

    _getCheckValue = (item, fieldName, value) => {
        const { slug } = item;
        const { key } = fieldName;
        if (value) {
            this.bodyData[key].push(slug);
        } else {
            this.bodyData[key].splice(this.bodyData[key].indexOf(slug), 1);
        }
        console.log('this.bodyData after', this.bodyData)

    }

    renderSubItem = ({ item, key }, fieldName) => {
        const { name, slug } = item;
        return (
            <View key={key}>
                <ReduxField
                    name={name}
                    inputType={'checkbox'}
                    callBack={(value) => this._getCheckValue(item, fieldName, value)}
                />
            </View>
        )
    }

    _onChangeText = (item, data, value) => {
        const { label: name, value: slug } = data;
        this._getCheckValue({ name, slug }, item, value);
        console.log('item, data, value', item, data, value)
    }

    _onPressAllergens = (item, fieldName, index) => {
        const { name, slug, selected } = item;
        this.freeFrom[index].selected = !selected;
        this._getCheckValue({ name, slug }, fieldName, this.freeFrom[index].selected);
        this.forceUpdate();
    }

    _renderAllergens = ({ item, index }) => {
        const { selected } = item;
        return (
            <TouchableOpacity key={index} onPress={() => this._onPressAllergens(item, { key: 'allergens' }, index)}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>

                    <View style={{
                        ...styles.freeFromView,
                        backgroundColor: (selected) ? AppColors.blue : AppColors.lightGray2
                    }}>
                        <Image source={{ uri: item.icon }} style={{
                            height: scale(30), width: scale(30),
                        }} />

                    </View>

                    <Text style={{ fontFamily: AppFonts.poppinsRegular, fontSize: scale(12) }}>{item.name}</Text>
                </View>

            </TouchableOpacity>
        )
    }

    renderItem = ({ item, key }) => {
        const keyName = item.key;
        if (!(this.bodyData[keyName] && this.bodyData[keyName].length)) {
            this.bodyData[keyName] = [];

        }
        let component = null;

        switch (keyName) {
            case 'allergens':
                if (!this.freeFrom.length) {
                    this.freeFrom = item.list.map((item, key) => ({ selected: false, ...item }));
                }
                component = (
                    <FlatList
                        columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
                        extraData={JSON.stringify(this.freeFrom)}
                        style={{ flex: 1 }}
                        data={this.freeFrom}
                        horizontal={false}
                        numColumns={3}
                        renderItem={({ item, index }) => this._renderAllergens({ item, index })}
                    />
                );
                break;
            case 'no_of_ingredients':
            case 'cook_time':
            case 'serving_size':
                component = (
                    <ReduxField
                        inputType={'dropdown'}
                        name={keyName}
                        data={item.list.map((item, key) => ({ label: item.name, value: item.slug }))}
                        callBack={(value, index, data) => this._onChangeText(item, data, value)}
                    />)
                break;
            default:
                component = (
                    <FlatList
                        data={item.list}
                        renderItem={(data) => self.renderSubItem(data, item)}
                    />
                )
                break;
        }
        return (
            <View key={key} style={{ paddingHorizontal: scale(20), backgroundColor: AppColors.white, paddingTop: scale(10) }}>
                <Text style={{ fontSize: scale(16), fontFamily: AppFonts.poppinsSemiBold }}>{item.name.toUpperCase()}</Text>
                {component}
            </View>
        )
    }

    _renderFilterData = (formData) => {
        this.props._renderFilterData(this.bodyData);
        this._closeModal();
    }

    recipes = () => {
        const { filterItems = [] } = this.state;
        const { tabName } = this.props;
        return (
            <FlatList
                extraData={JSON.stringify(this.freeFrom)}
                style={{ backgroundColor: AppColors.white }}
                data={filterItems}
                renderItem={this.renderItem}
                key={tabName}
            />
        )
    }

    products = () => {
        const { filterItems = [] } = this.state;
        const { tabName } = this.props;
        return (
            <FlatList
                extraData={JSON.stringify(this.freeFrom)}
                style={{ backgroundColor: AppColors.white }}
                data={filterItems}
                renderItem={this.renderItem}
                key={tabName}
            />
        )
    }

    render() {
        const { filterModal = false, tabName, handleSubmit } = this.props;
        let viewComponent = null;
        if (this.loadingPage) {
            viewComponent = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Please wait...</Text><ActivityIndicator />
                </View>
            )
        } else {
            let componentData = null;
            if (tabName === 'products') {
                componentData = this.products();
            } else {
                componentData = this.recipes();
            }
            viewComponent = (
                <View style={{ flex: 1, backgroundColor: AppColors.lightGray }}>
                    <View style={{ paddingHorizontal: scale(10), }}>
                        <View style={{
                            flexDirection: 'row',
                            paddingVertical: scale(15),
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <View style={{ flexDirection: 'column', }}>
                                <TouchableOpacity onPress={this._closeModal.bind(this)}>
                                    <Fontisto name={'close-a'} style={{
                                        color: AppColors.blue, fontSize: scale(20),
                                        paddingBottom: scale(3)
                                    }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={styles.titleText}>Filter</Text>
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                {/* <Text style={styles.clearText}>Clear</Text> */}
                            </View>
                        </View>
                    </View>
                    {componentData}
                    <TouchableOpacity onPress={handleSubmit(this._renderFilterData.bind(this))} style={Layout.commonBtn}>
                        <Text style={Layout.commonBtnText}>Apply Filter</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={filterModal}
                onRequestClose={() => { }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: AppColors.lightGray }}>
                    {viewComponent}
                </SafeAreaView>
            </Modal>
        )
    }
}

const withForm = reduxForm({
    form: 'FilterForm'
});

export default withLoader(withLogin(withDashboard(withForm(FilterModal))));

const styles = StyleSheet.create({
    titleText: {
        fontSize: scale(25),
        paddingHorizontal: scale(10),
        fontFamily: AppFonts.AlegreyaBold
    },
    clearText: {
        fontSize: scale(12),
        paddingHorizontal: scale(10),
        color: AppColors.blue,
        fontFamily: AppFonts.poppinsMedium
    },
    freeFromView: {
        margin: scale(4),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(25),
        height: scale(50),
        width: scale(50),
    }
})
