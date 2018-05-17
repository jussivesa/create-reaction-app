import React from "react";
import { Components, getRawComponent, replaceComponent } from "@reactioncommerce/reaction-components";
import { ReactionLayout } from "/imports/plugins/core/layout/lib";

class ProductDetail extends getRawComponent("ProductDetail") {
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  render() {
    return (
      <div className="pdp" style={{ position: "relative" }}>
        <div className="container-main pdp-container" itemScope itemType="http://schema.org/Product">
          <div className="row">
            <Components.Alerts placement="productManagement" />
            <ReactionLayout
              context={this}
              layoutName={this.props.layout}
              layoutProps={this.props}
            />
          </div>
        </div>
        <div className="pdp-filler"><img alt="Woman in front of skyscrapers" src="/resources/pattern.jpg" /></div>
        <Components.SimilarProducts {...this.props} />
      </div>
    );
  }
}

replaceComponent("ProductDetail", ProductDetail);
