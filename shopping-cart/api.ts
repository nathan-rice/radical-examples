import * as Radical from 'radical';
import * as Redux from 'redux';

export class Product {

    private static nextId = 0;
    static getId() {
        return this.nextId++;
    }

    constructor(public title: string, public price: number, public id: number = -1) {
        if (id < 0) this.id = Product.getId();
    }
}

/* This will represent the state object for both StoreContainer's defaultState, and for
 * any reducers attached to StoreContainer
 */
interface StoreContainerState {
    products: {[key: number]: Product};
    quantities: {[key: number]: number};
}

/* Since our StoreContainers (the shopping cart and inventory) will group and provide state
 * for a set of related Actions, they will be Namespaces.
 */
class StoreContainer extends Radical.Namespace {
    
    // An empty object is assumed as the default if none is specified
    defaultState: StoreContainerState = {products:{}, quantities: {}};

    // A convenience method wrapper around setQuantity
    add(product: Product, quantity: number = 1) {
        let startingQuantity = this.getQuantity(product);
        // here we're calling the initiator function of the setQuantity Action
        return this.setQuantity(product, startingQuantity + quantity);
    }

    // Another convenience method wrapper around setQuantity
    remove(product: Product, quantity: number = 1) {
        let startingQuantity = this.getQuantity(product);
        if (startingQuantity >= quantity) {
            // here we're calling the initiator function of the setQuantity Action
            this.setQuantity(product, startingQuantity - quantity);
            return true;
        } else return false;
    }
    
    // get all the products in the container with a quantity of 1 or more
    list() {
        // the Namespace's getState method gets local state automatically
        let state = this.getState(), quantities = state.quantities, products = [];
        for (let key in quantities) {
            if (quantities.hasOwnProperty(key) && quantities[key] > 0) {
                products.push(state.products[key]);
            }
        }
        return products;
    }

    /* Here we're creating an Action for the first time.  Note that the create method is
     * preferable to using new in most cases.
     */
    setQuantity = Radical.Action.create({
        /* This initiator doesn't do much, it could almost be replaced by the default
         * initiator.  Note that the first argument to the initiator is the action itself.
         * That argument is automatically bound to the current action, while this is
         * bound to the parent Namespace.
         */
        initiator: function(action, product: Product, quantity: number) {
            return action.dispatch({product, quantity});
        },
        /* Notice this reducer only has to deal with a StoreContainerState object, and
         * you can safely modify state directly, as it is a copy of the original.
         */
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
    // Since we don't need to pass anything here, the default initiator will be fine
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

/* The inventory and shopping cart functionality has been defined, now there needs to 
 * be something to tie everything together into a cohesive application.  Store will
 * serve to provide the top level interface.
 */
class Store extends Radical.Namespace {
    inventory = StoreContainer.create({name: "Inventory"}) as StoreContainer;
    shoppingCart = ShoppingCart.create() as ShoppingCart;
    
    // Move an item from inventory to the shopping cart
    order(product: Product, quantity: number = 1) {
        if (this.inventory.remove(product, quantity)) {
            this.shoppingCart.add(product, quantity);
            return true;
        } else return false;
    }
    
    // Move an item from the shopping cart to inventory
    cancelOrder(product: Product, quantity: number = 1) {
        if (this.shoppingCart.remove(product, quantity)) {
            this.inventory.add(product, quantity);
            return true;
        } else return false;
    }
}

var w = (window as any),
    devToolExtension = w.devToolsExtension ? w.devToolsExtension() : undefined;

export const store = Redux.createStore(state => state, null, devToolExtension);

// Once you have your Redux store, create a web Store and wire it in
export const webStore = Store.create({store: store}) as Store;

/* You can just use the top level Store's reduce function, it will dispatch
 * relevant portions of the state tree to its children and their Actions.
 * 
 * Don't do this until you have completely configured your top-level Namespace.
 */
store.replaceReducer(webStore.reduce);

// Now to give the people something to buy!
webStore.inventory
    .add(new Product("Tablet", 500), 1)
    .add(new Product("Shirt", 20), 5)
    .add(new Product("Album", 15), 10);