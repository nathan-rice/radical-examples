import * as api from './api';
import * as React from 'react';
import {connect} from 'react-redux';

export const App = ({}) => {
    return (
        <div>
            <h2>Shopping Cart Example</h2>
            <hr/>
            <Products title="Products"/>
            <hr/>
            <Cart />
        </div>
    )
};

interface IProductsProps {
    title: string;
    products?: api.Product[];
}

/* Note here that I'm wiring the Products component directly to the API via React/Redux.
 * I find this both conceptually clearer and more convenient.
 */
function productsLink() {
    return {products: api.webStore.inventory.list()}
}

// A small workaround for broken React/Redux typings.
const productsLinkConnect = (productsClass: any): any => connect(productsLink)(productsClass);

@productsLinkConnect
class Products extends React.Component<IProductsProps, any> {
    render() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                <div>
                    {this.props.products.map(product =>
                    <ProductItem key={product.id} product={product}/>
                        )}
                </div>
            </div>
        )
    }
}

interface ICartProps {
    products?: api.Product[];
}

// Using the same React/Redux pattern
function cartLink() {
    return {products: api.webStore.shoppingCart.list()}
}

// That workaround again
const cartLinkConnect = (cartClass: any): any => connect(cartLink)(cartClass);

@cartLinkConnect
export class Cart extends React.Component<ICartProps, any> {
    
    getProductNodes() {
        const products = this.props.products;
        return !products.length ?
            <em>Please add some products to cart.</em> :
            products.map(product => <CartItem key={product.id} product={product} />);
    }
    
    /* Here we utilize the api directly.  Another option is to pass around the shoppingCart
     * Namespace as a prop; that shifts coupling from the component itself to its parents.
     */
    render() {
        return (
            <div>
                <h3>Your Cart</h3>
                <div>{this.getProductNodes()}</div>
                <p>Total: ${api.webStore.shoppingCart.getTotal()}</p>
                <button onClick={api.webStore.shoppingCart.checkout}
                        disabled={this.props.products.length ? '' : 'disabled'}>
                    Checkout
                </button>
            </div>
        )
    }
}

export class CartItem extends React.Component<IProductItemProps, any> {
    render() {
        const {product} = this.props;

        return (
            <div
                style={{ marginBottom: 20 }}>
                <Product
                    title={product.title}
                    price={product.price}
                    quantity={api.webStore.shoppingCart.getQuantity(product)}
                    key={product.id}/>
                <button onClick={() => api.webStore.cancelOrder(product)}>Remove</button>
            </div>
        )
    }
}

interface IProductProps {
    price: number;
    quantity?: number;
    title: string;
}

export class Product extends React.Component<IProductProps, any> {
    render() {
        const {price, quantity, title} = this.props;
        return <span> {title} - ${price} {quantity ? `x ${quantity}` : null} </span>
    }
}

interface IProductItemProps {
    product: api.Product;
}

export class ProductItem extends React.Component<IProductItemProps, any> {
    render() {
        const {product} = this.props;

        return (
            <div
                style={{ marginBottom: 20 }}>
                <Product
                    title={product.title}
                    price={product.price}/>
                <button onClick={() => api.webStore.order(product)}>Add to cart</button>
            </div>
        )
    }
}