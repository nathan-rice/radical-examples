import * as Radical from 'radical';
import * as Redux from 'redux';

export class Product {

    static nextId = 0;
    static getId() {
        return this.nextId++;
    }

    constructor(public title: string, public price: number, public id: number = -1) {
        if (id < 0) this.id = Product.getId();
    }
}

interface StoreContainerState {
    products: {[key: number]: Product};
    quantities: {[key: number]: number};
}

class StoreContainer extends Radical.Namespace {
    
    defaultState: StoreContainerState = {products:{}, quantities: {}};

    add(product: Product, quantity: number = 1) {
        let startingQuantity = this.getQuantity(product);
        this.setQuantity(product, startingQuantity + quantity);
        return this;
    }

    remove(product: Product, quantity: number = 1) {
        let startingQuantity = this.getQuantity(product);
        if (startingQuantity >= quantity) {
            this.setQuantity(product, startingQuantity - quantity);
            return true;
        } else return false;
    }
    
    list() {
        let state = this.getState(), quantities = state.quantities, products = [];
        for (let key in quantities) {
            if (quantities.hasOwnProperty(key) && quantities[key] > 0) {
                products.push(state.products[key]);
            }
        }
        return products;
    }

    setQuantity = Radical.Action.create({
        initiator: function(action, product: Product, quantity: number) {
            return action.dispatch({product, quantity});
        },
        reducer: function (state: StoreContainerState, action) {
            let {product, quantity} = action;
            if (!state.products[product.id]) {
                state.products = Object.assign({[product.id]: product}, state.products);
            }
            state.quantities = Object.assign({}, state.quantities);
            state.quantities[product.id] = quantity;
            return state;
        }
    });

    getQuantity(product: Product): number {
        return this.getState().quantities[product.id] || 0;
    }
}

class ShoppingCart extends StoreContainer {
    checkout = Radical.Action.create({
        reducer: function (state: StoreContainerState) {
            state.products = {};
            state.quantities = {};
            return state;
        }
    });
    
    getTotal() {
        let {quantities, products} = this.getState(), total = 0;
        for (let key in quantities) {
            if (quantities.hasOwnProperty(key)) total += quantities[key] * products[key].price
        }
        return total.toFixed(2);
    };
}

class Store extends Radical.Namespace {
    inventory = StoreContainer.create({name: "Inventory"}) as StoreContainer;
    shoppingCart = ShoppingCart.create() as ShoppingCart;
    
    order(product: Product, quantity: number = 1) {
        if (this.inventory.remove(product, quantity)) {
            this.shoppingCart.add(product, quantity);
            return true;
        } else return false;
    }
    
    cancelOrder(product: Product, quantity: number = 1) {
        if (this.shoppingCart.remove(product, quantity)) {
            this.inventory.add(product, quantity);
            return true;
        } else return false;
    }
}

var w = (window as any), devToolExtension = w.devToolsExtension ? w.devToolsExtension() : undefined;
export const store = Redux.createStore(state => state, null, devToolExtension);
export const webStore = Store.create({store: store}) as Store;

store.replaceReducer(webStore.reduce);

webStore.inventory
    .add(new Product("Overpriced tablet", 500), 1)
    .add(new Product("Kanye west plain white cotton shirt", 120), 5)
    .add(new Product("Random artist's random album", 10), 10);