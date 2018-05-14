import React from "react";
import { PropTypes } from "prop-types";
import { replaceComponent } from "@reactioncommerce/reaction-components";
import ProductGridItemCore from "/imports/plugins/included/product-variant/components/customer/productGridItem";


class ProductGridItem extends ProductGridItemCore {
  static propTypes = {
    showFeaturedLabel: PropTypes.bool,
    ...ProductGridItemCore.propTypes
  };

  static defaultProps = {
    showFeaturedLabel: true
  };

  static labelColorPalette = [
    "#2899D3", // blue
    "#40e0d0", // turquoise
    "#F2542F" // orange
  ];

  renderFeaturedProductLabel() {
    console.warn('renderFeaturedProductLabel', this.props.product);
    const { featuredProductLabel } = this.props.product;
    let bgColor;
    if (featuredProductLabel) {
      const hash = featuredProductLabel.split("").reduce((acc, value, i) => {
        const code = featuredProductLabel.charCodeAt(i);
        return code + acc;
      }, 0);
      bgColor = ProductGridItem.labelColorPalette[hash % 3];
    }
    return (
      <div className="grid-item-featured-product-label" style={bgColor ? { backgroundColor: bgColor } : {}}>
        {featuredProductLabel}
      </div>
    );
  }

  render() {
    const { product, isSearch } = this.props;
    return (
      <li
        className={this.productClassNames}
        data-id={product._id}
        id={product._id}
      >
        <div className={(isSearch) ? "item-content" : ""}>
          <span className="product-grid-item-alerts" />

          <a className="product-grid-item-images"
            href={this.productURL}
            data-event-category="grid"
            data-event-label="grid product click"
            data-event-value={product._id}
            onClick={this.handleClick}
          >
            <div className="product-primary-images">
              {this.props.showFeaturedLabel && this.renderFeaturedProductLabel()}
              {this.renderMedia()}
            </div>
            {this.renderAdditionalMedia()}
          </a>

          {!isSearch && this.renderNotices()}
          {this.renderGridContent()}
        </div>
      </li>
    );
  }
}

export default ProductGridItem;
