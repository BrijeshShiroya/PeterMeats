import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { scale } from '../utils/FontScaler';
import CardView from "../common/CardView";
import withProduct, { getProductList } from '../redux/Dashboard/action';
import withLogin from '../redux/Login/action';
import withLoader from '../redux/Loader/action';
import AppColors from '../assets/styles/colors';
import FilterModal from '../common/FilterModal';
import { NavigateChildRoute, NavigateParentRoute } from '../utils/Global';
import AppFonts from '../assets/fonts/';
import { store } from '../redux/store';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
        }
        this.currentPage = props.productList.max_num_pages || 1;;
        this.loadMore = false;
    }

    componentDidMount = async () => {
        this._callApi();
    }

    _callApi = async (extraParams, refresh = false, pageNo = 1, loader = true) => {
        console.log('extraParams', extraParams)
        const { getProductList, loginData, setLoader, productList } = this.props;
        if (productList.products.length == 0 || refresh) {
            const token = loginData.data._token;
            await setLoader(loader);
            const params = `oauth_token=${token}&page=${pageNo}&limit=50${extraParams}`;
            console.log('params', params)
            const response = await getProductList(params, 'products/index');
            await setLoader(false);
            return response;
        }
    }

    _renderFilterData = (data) => {
        let params = '';
        Object.keys(data).map((item, key) => {
            params += `&${item}=${data[item] || ''}`
        })
        console.log('_renderFilterData', params)
        this._callApi(params, true);
    }

    _toggleModal = (item) => {
        NavigateParentRoute(this.props, 'ProductDetails', { selectedProduct: item })
    }

    _handleRefresh = () => {
        this.currentPage = 1;
        this._callApi('', true);
    }

    _endReached = async () => {
        try {
            const { productList } = this.props;
            if (!this.loadMore && this.currentPage <= productList.max_num_pages) {
                this.loadMore = true;
                this.forceUpdate();
                let oldProductList = productList;
                this.currentPage++;
                const newData = await this._callApi('', true, this.currentPage, false);
                console.log('newData', newData)
                this.loadMore = false;
                if (newData.success) {
                    oldProductList.products = [...oldProductList.products, ...newData.products]
                    await store.dispatch(getProductList(oldProductList));
                }
            }
        } catch (error) {
            console.log('_endReached', error)
        }
    }

    render() {
        const { filterModal = false, productList = [] } = this.props;
        const { refreshing } = this.state;
        console.log('productList', productList)
        return (
            <View style={styles.MainContainer}>
                {/* <Text style={styles.titleText}>Products</Text> */}
                {
                    productList.products
                        ?
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={productList.products}
                                removeClippedSubviews={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => this._toggleModal(item)}>
                                        <CardView
                                            image={{ uri: item.image }}
                                            title={item.name}
                                            price={item.price}
                                            disc={item.description}
                                        />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                refreshing={refreshing}
                                onRefresh={this._handleRefresh}
                                onEndReached={this._endReached}
                                onEndReachedThreshold={0.5}
                            />
                            {
                                this.loadMore
                                    ? <ActivityIndicator style={{ marginVertical: scale(10) }} />
                                    : null
                            }
                        </View>
                        : <Text style={styles.subtitle}>No Data Found</Text>
                }
                {filterModal ? <FilterModal _renderFilterData={this._renderFilterData} tabName={'products'} /> : null}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#455A64',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    MainContainer: {
        flex: 1,
        width: '100%'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    cardViewStyle: {
        width: '80%',
        height: scale(150),
    },
    titleText: {
        fontSize: scale(25),
        paddingHorizontal: scale(10),
        backgroundColor: AppColors.lightBlue,
        fontFamily: AppFonts.AlegreyaBold
    },
    subtitle: {
        fontSize: scale(15),
        paddingHorizontal: scale(10),
        color: AppColors.gray,
        fontFamily: AppFonts.poppinsRegular,
        textAlign: 'center'
    }
});

export default withLoader(withLogin(withProduct(Product)));