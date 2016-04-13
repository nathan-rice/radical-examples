import * as api from './api';
import * as React from 'react';

export const App = ({}) => {
    return (
      <div>
        <h2>Shopping Cart Example</h2>
        <hr/>
        <ProductsContainer />
        <hr/>
        <CartContainer />
      </div>
    )
};

interface IProductsContainerProps {
  products: api.Product[];
  addToCart: Function;
}

class ProductsContainer extends React.Component<IProductsContainerProps, any> {
  render() {
    return (
      <ProductsList title="Products">
        {this.props.products.map(product =>
          <ProductItem
            key={product.id}
            product={product}
            onAddToCartClicked={() => api.webStore.shoppingCart.addToCart(product.id)} />
        )}
      </ProductsList>
    )
  }
}

interface ICartProps {
  products: api.Product[];
  total: string;
  onCheckoutClicked: Function;
}

export class Cart extends React.Component<ICartProps, any> {
  render() {
    const { products, total, onCheckoutClicked } = this.props;

    const hasProducts = products.length > 0;
    const nodes = !hasProducts ?
      <em>Please add some products to cart.</em> :
      products.map(product =>
        <Product
          title={product.title}
          price={product.price}
          quantity={product.quantity}
          key={product.id}/>
    );

    return (
      <div>
        <h3>Your Cart</h3>
        <div>{nodes}</div>
        <p>Total: &#36;{total}</p>
        <button onClick={onCheckoutClicked}
          disabled={hasProducts ? '' : 'disabled'}>
          Checkout
        </button>
      </div>
    )
  }
}

interface IProductProps {
  price?: number;
  quantity?: number;
  title?: string;
}

export class Product extends React.Component<IProductProps, any> {
  render() {
    const { price, quantity, title } = this.props;
    return <div> {title} - &#36;{price} {quantity ? `x ${quantity}` : null} </div>
  }
}

interface IProductItemProps {
  product: api.Product;
  onAddToCartClicked: Function;
}

export class ProductItem extends React.Component<IProductItemProps, any> {
  render() {
    const { product } = this.props;

    return (
      <div
        style={{ marginBottom: 20 }}>
        <Product
          title={product.title}
          price={product.price} />
        <button
          onClick={this.props.onAddToCartClicked}
          disabled={product.inventory > 0 ? '' : 'disabled'}>
          {product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
        </button>
      </div>
    )
  }
}

interface IProductsListProps {
  children?: any;
  title: string;
}

export class ProductsList extends React.Component<IProductsListProps, any> {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <div>{this.props.children}</div>
      </div>
    )
  }
}