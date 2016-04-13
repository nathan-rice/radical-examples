import * as Radical from 'radical';
import * as Redux from 'redux';

export class Product {
    constructor(public title: string, public id: number) {}
}

export class ShoppingCartItem {
    constructor(public product: Product, public price: number) {}
}

export class StoreContainerItem {
    constructor(public product: Product, public price: number, public quantity: number = 1) {}
}

class StoreContainer extends Radical.Namespace {
    
    defaultState: {items:StoreContainerItem[]} = {items:[]};
    
    add = Radical.Action.create({
        initiator: function (action, product: Product, price: number, quantity: number = 1) {
            return action.dispatch({product, price, quantity});
        },
        reducer: function (state, action) {
            
            state.items = [...state.items, action.item];
            return state;
        }
    });

    remove = Radical.Action.create({
        initiator: function (action, product: Product, price: number, quantity: number = 1) {
            action.dispatch({product, price, quantity});
        },
        reducer: function (state, action) {
            state.items = state.items.filter(product => action.product != product);
            return state;
        }
    });
    
    list() {
        return this.getState().items;
    }
    
    setQuantity = Radical.Action.create({
        initiator: function (action, product, price) {
            return action.dispatch({product, price});
        },
        reducer: function (state, action) {
            state.items = state.items.map(item => new StoreContainerItem(action.product, action.price))
        }
    });
    
    containsItem(product: Product, price: number) {
        return this.getState().items
                .filter(item => item.product.id == product.id && item.price == price)
                .length > 0;
    }
}

class ShoppingCart extends Radical.Namespace {
    defaultState: {items:ShoppingCartItem[]} = {items:[]};



    checkout = Radical.Action.create({
        reducer: function (state, action) {
            state.items = [];
            return state;
        }
    });



    getTotal = Radical.Action.create(function () {
        let state = this.getState();
        return state.items.reduce((total, item: ShoppingCartItem) => total + item.price, 0).toFixed(2);
    });
}

class Inventory extends Radical.Namespace {
    defaultState: {items: StoreContainerItem[]} = {items: []};

    getItems() {
        return this.getState().items;
    };

    addProduct = Radical.Action.create({
        initiator: function(action, product: Product, price: number, quantity: number = 0) {
            return action.dispatch({product: new StoreContainerItem(product, price, quantity)});
        },
        reducer: function(state, action) {
            state.items = [...state.items, action.product];
            return state;
        }
    });

    isAvailable(product: Product): boolean {
        let state = this.getState();
        for (let i = 0; i < state.items.length; i++) {
            let item = state.items[i];
            if (product.id == item.product.id && item.quantity > 0) return true;
        }
        return false;
    }

    requestProduct = Radical.Action.create({
        initiator: function (action, product: Product) {
            if (this.isAvailable(product)) {
                action.dispatch({product: product});
                return true;
            } else return false;
        },
        reducer: function (state, action: {type: string, product: Product}) {
            state.items = state.items.map(item => {
                if (item.product.id == action.product.id) {
                    return new StoreContainerItem(item.product, item.price, item.quantity - 1);
                } else return item;
            });
            return state;
        }
    })
}

class Store extends Radical.Namespace {
    inventory = Inventory.create() as Inventory;
    shoppingCart = ShoppingCart.create() as ShoppingCart;
}

export const store = Redux.createStore(state => state);
export const webStore = Store.create({getState: store.getState, dispatch: store.dispatch}) as Store;

store.replaceReducer(webStore.reduce);