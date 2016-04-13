import * as Radical from 'radical';
import * as Redux from 'redux';

export class Product {
    constructor(public title: string, public id: number, public price: number, public quantity: number = 0,
                public inventory: number = 0) {}
}

class ShoppingCart extends Radical.Namespace {
    addToCart = Radical.Action.create(function (action, product: Product) {

    });

    removeFromCart = Radical.Action.create(function (action, product: Product) {

    });
}

class Inventory extends Radical.Namespace {
    defaultState = {products: [], price: {}, inventory: {}};

    listProducts = Radical.Action.create(function (action) {

    });

    getPrice = Radical.Action.create(function (action, product: Product) {});

    setPrice = Radical.Action.create(function (action, product: Product) {});

    getInventory = Radical.Action.create(function (action, product: Product) {});

    setInventory = Radical.Action.create(function (action, product: Product) {});
}

class Store extends Radical.Namespace {
    inventory = Inventory.create() as Inventory;
    shoppingCart = ShoppingCart.create() as ShoppingCart;
}

export const store = Redux.createStore(state => state);
export const webStore = Store.create({getState: store.getState, dispatch: store.dispatch}) as Store;

store.replaceReducer(webStore.reduce);