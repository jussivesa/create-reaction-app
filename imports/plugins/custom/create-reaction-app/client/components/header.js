import React from "react";
import { registerComponent, Components } from "@reactioncommerce/reaction-components";
import UtilityBar from "./utilityBar";
import Blaze from "meteor/gadicc:blaze-react-component";

class SwagShopHeader extends React.Component {
  render() {
    return (
      <div>
        <UtilityBar />
        <Components.NavBar/>
        <Blaze template="cartDrawer" className="reaction-cart-drawer" />
        <Components.Hero/>
      </div>
    );
  }
}


registerComponent("SwagShopHeader", SwagShopHeader);

export default SwagShopHeader;
