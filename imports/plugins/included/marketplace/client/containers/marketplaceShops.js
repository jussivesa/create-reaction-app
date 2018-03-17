import { composeWithTracker, registerComponent } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Shops } from "/lib/collections";
import { Reaction } from "/client/api";
import MarketplaceShops from "../components/marketplaceShops";

const onWorkflowChange = (shopId, value) => {
  Meteor.call("marketplace/updateShopWorkflow", shopId, value);
};

const composer = (props, onData) => {
  // Subscribe to merchant shops and get all shops (excluding the primary shop) if subscription is ready
  if (Meteor.subscribe("MerchantShops").ready()) {
    const shops = Shops.find({
      _id: {
        $nin: [Reaction.getPrimaryShopId()]
      }
    }).fetch();

    onData(null, {
      shops,
      onWorkflowChange
    });
  }
};

registerComponent("MarketplaceShops", MarketplaceShops, composeWithTracker(composer));

export default composeWithTracker(composer)(MarketplaceShops);
