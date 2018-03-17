import SimpleSchema from "simpl-schema";
import { check } from "meteor/check";
import { Tracker } from "meteor/tracker";
import { registerSchema } from "@reactioncommerce/reaction-collections";
import { shopIdAutoValue, schemaIdAutoValue } from "./helpers";
import { Address } from "./address";
import { Invoice } from "./payments";
import { PackageConfig } from "./registry";
import { Workflow } from "./workflow";

/**
 * @name ShippoShippingMethod
 * @memberof schemas
 * @type {SimpleSchema}
 * @todo Move Shippo-related schema to Shippo module
 * @summary This will only exist in ShippingMethods Inside Cart/Order.
 * This does not exist in DB Shipping Collection as Shippo Methods are Dynamic.
 * @property {String} serviceLevelToken optional
 * @property {String} rateId optional
 */
export const ShippoShippingMethod = new SimpleSchema({
  serviceLevelToken: {
    type: String,
    optional: true
  },
  rateId: {
    type: String,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("ShippoShippingMethod", ShippoShippingMethod);

/**
 * @name ShippingMethod
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} _id Shipment method Id
 * @property {String} name Method name
 * @property {String} label Public label
 * @property {String} group Group, allowed values: `Ground`, `Priority`, `One Day`, `Free`
 * @property {Number} cost optional
 * @property {Number} handling optional, default value: `0`
 * @property {Number} rate Rate
 * @property {Boolean} enabled default value: `false`
 * @property {Array} validRanges optional, Matching cart ranges
 * @property {Object} validRanges.$ optional
 * @property {Number} validRanges.begin optional
 * @property {Number} validRanges.end optional
 * @property {Array} validLocales optional
 * @property {Object} validLocales.$ optional
 * @property {String} validLocales.$.origination optional
 * @property {String} validLocales.$.destination optional
 * @property {Number} validLocales.$.deliveryBegin optional
 * @property {Number} validLocales.$.deliveryEnd optional
 * @property {String} carrier optional
 * @property {ShippoShippingMethod} settings optional
 */
export const ShippingMethod = new SimpleSchema({
  "_id": {
    type: String,
    label: "Shipment Method Id",
    autoValue: schemaIdAutoValue
  },
  "name": {
    type: String,
    label: "Method Name",
    optional: true
  },
  "label": {
    type: String,
    label: "Public Label"
  },
  "group": {
    type: String,
    label: "Group",
    allowedValues: ["Ground", "Priority", "One Day", "Free"],
    optional: true
  },
  "cost": {
    type: Number,
    label: "Cost",
    optional: true
  },
  "handling": {
    type: Number,
    label: "Handling",
    optional: true,
    defaultValue: 0,
    min: 0
  },
  "rate": {
    type: Number,
    label: "Rate",
    min: 0
  },
  "enabled": {
    type: Boolean,
    label: "Enabled",
    defaultValue: false
  },
  "validRanges": {
    type: Array,
    optional: true,
    label: "Matching Cart Ranges"
  },
  "validRanges.$": {
    type: Object,
    optional: true
  },
  "validRanges.$.begin": {
    type: Number,
    label: "Begin",
    optional: true
  },
  "validRanges.$.end": {
    type: Number,
    label: "End",
    optional: true
  },
  "validLocales": {
    type: Array,
    optional: true,
    label: "Matching Locales"
  },
  "validLocales.$": {
    type: Object,
    optional: true
  },
  "validLocales.$.origination": {
    type: String,
    label: "From",
    optional: true
  },
  "validLocales.$.destination": {
    type: String,
    label: "To",
    optional: true
  },
  "validLocales.$.deliveryBegin": {
    type: SimpleSchema.Integer,
    label: "Shipping Est.",
    optional: true
  },
  "validLocales.$.deliveryEnd": {
    type: SimpleSchema.Integer,
    label: "Delivery Est.",
    optional: true
  },
  "carrier": { // kind of denormalizing, useful for having it in shipmentMethod( cart & order)
    type: String, // Alternatively we can make an extra Schema:ShipmentMethod, that inherits
    optional: true // ShippingMethod and add the optional carrier field
  },
  "settings": {
    type: ShippoShippingMethod,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("ShippingMethod", ShippingMethod);

/**
 * @name ShipmentQuote
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} carrier Name of carrier
 * @property {ShippingMethod} method ShippingMethod
 * @property {Number} rate default value: `0.00`
 */
export const ShipmentQuote = new SimpleSchema({
  carrier: {
    type: String
  },
  method: {
    type: ShippingMethod
  },
  rate: {
    type: Number,
    defaultValue: 0.00
  },
  shopId: {
    type: String,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("ShipmentQuote", ShipmentQuote);

/**
 * @name ShipmentItem
 * @memberof schemas
 * @type {SimpleSchema}
 * @summary Populate with order.items that are added to a shipment
 * @property {String} _id Shipment Line Item optional
 * @property {String} productId required
 * @property {String} shopId Shipment Item ShopId optional
 * @property {Number} quantity required
 * @property {String} variantId required
 */
export const ShipmentItem = new SimpleSchema({
  _id: {
    type: String,
    label: "Shipment Line Item",
    optional: true,
    autoValue: schemaIdAutoValue
  },
  productId: {
    type: String,
    index: 1
  },
  shopId: {
    type: String,
    index: 1,
    label: "Shipment Item ShopId",
    optional: true
  },
  quantity: {
    label: "Quantity",
    type: SimpleSchema.Integer,
    min: 0
  },
  variantId: {
    type: String
  }
}, { check, tracker: Tracker });

registerSchema("ShipmentItem", ShipmentItem);

/**
 * @name ShippingParcel
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} containers optional
 * @property {Number} length optional
 * @property {Number} width optional
 * @property {Number} height optional
 * @property {Number} weight optional
 */
export const ShippingParcel = new SimpleSchema({
  containers: {
    type: String,
    optional: true
  },
  length: {
    type: Number,
    optional: true
  },
  width: {
    type: Number,
    optional: true
  },
  height: {
    type: Number,
    optional: true
  },
  weight: {
    type: Number,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("ShippingParcel", ShippingParcel);

/**
 * @name ShippoShipment
 * @summary Specific properties of Shipment for use with Shippo. We don't use
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} transactionId optional
 * @property {String} trackingStatusStatus optional Tracking Status's status
 * @property {String} trackingStatusDate optional
 */
export const ShippoShipment = new SimpleSchema({
  transactionId: {
    type: String,
    optional: true
  },
  trackingStatusStatus: { // cause tracking_status.status
    type: String,
    optional: true
  },
  trackingStatusDate: {
    type: String,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("ShippoShipment", ShippoShipment);

/**
 * @name ShipmentQuotesQueryStatusUsed
 * @todo Should requestStatus be required or not?
 * @memberof schemas
 * @type {SimpleSchema}
 * @summary Status of a query/consumption of a shipping provider's API (e.g Shippo) for shipping quotations.
 * @description Shipping quotations are the costs from different shipping methods like Fedex, DHL etc of
 * shipping one or more items to a particular place in a given amount of time.)
 * @property {String} requestStatus optional, default value: `noRequestsYet`
 * @property {String} shippingProvider optional
 * @property {Number} numOfShippingMethodsFound optional
 * @property {String} message optional
 */
export const ShipmentQuotesQueryStatus = new SimpleSchema({
  requestStatus: {
    type: String,
    optional: true,
    defaultValue: "noRequestsYet"
  },
  shippingProvider: {
    type: String,
    optional: true
  },
  numOfShippingMethodsFound: {
    type: SimpleSchema.Integer,
    optional: true
  },
  message: {
    type: String,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("ShipmentQuotesQueryStatus", ShipmentQuotesQueryStatus);

/**
 * @name Shipment
 * @summary Used for cart/order shipment tracking
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} _id Shipment ID
 * @property {String} shopId required
 * @property {String} paymentId Payment ID
 * @property {Address} address optional
 * @property {ShippingMethod} shipmentMethod optional
 * @property {ShipmentQuote[]} shipmentQuotes optional
 * @property {ShipmentQuotesQueryStatus} shipmentQuotesQueryStatus optional
 * @property {String} tracking optional
 * @property {ShippingParcel} parcel optional
 * @property {ShipmentItem[]} items optional
 * @property {Workflow} workflow optional
 * @property {Invoice} invoice optional
 * @property {Object[]} transactions optional
 * @property {String} shippingLabelUrl For printable Shipping label
 * @property {String} customsLabelUrl For customs printable label
 * @property {ShippoShipment} shippo For Shippo specific properties
 */
export const Shipment = new SimpleSchema({
  "_id": {
    type: String,
    label: "Shipment Id",
    autoValue: schemaIdAutoValue
  },
  "shopId": {
    type: String
  },
  "paymentId": {
    type: String,
    label: "Payment Id",
    optional: true
  },
  "address": {
    type: Address,
    optional: true
  },
  "shipmentMethod": {
    type: ShippingMethod,
    optional: true
  },
  "shipmentQuotes": {
    type: Array,
    optional: true
  },
  "shipmentQuotes.$": {
    type: ShipmentQuote,
    optional: true
  },
  "shipmentQuotesQueryStatus": {
    type: ShipmentQuotesQueryStatus,
    optional: true,
    defaultValue: {}
  },
  "tracking": {
    type: String,
    optional: true
  },
  "parcel": {
    type: ShippingParcel,
    optional: true
  },
  "items": {
    type: Array,
    optional: true
  },
  "items.$": {
    type: ShipmentItem,
    optional: true
  },
  "workflow": {
    type: Workflow,
    optional: true,
    defaultValue: {}
  },
  "invoice": {
    type: Invoice,
    optional: true
  },
  "transactions": {
    type: Array,
    optional: true
  },
  "transactions.$": {
    type: Object,
    optional: true,
    blackbox: true
  },
  "shippingLabelUrl": {
    type: String,
    optional: true
  },
  "customsLabelUrl": {
    type: String,
    optional: true
  },
  "shippo": {
    type: ShippoShipment,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("Shipment", Shipment);

/**
 * @name ShippoShippingProvider Schema
 * @summary Specific properties for use with Shippo.
 * @description We don't use ShippingProvider service* fields because
 * Shippo is on level higher service than simple carrier's ,e.g Fedex api.
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} carrierAccountId optional
 */
export const ShippoShippingProvider = new SimpleSchema({
  carrierAccountId: {
    type: String,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("ShippoShippingProvider", ShippoShippingProvider);

/**
 * @name ShippingProvider
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} _id optional
 * @property {String} name optional
 * @property {String} label optional
 * @property {Boolean} enabled optional, default value: `true`
 * @property {String} serviceAuth optional
 * @property {String} serviceSecret optional
 * @property {String} serviceUrl optional
 * @property {ShippoShippingProvider} shippoProvider optional
 */
export const ShippingProvider = new SimpleSchema({
  _id: {
    type: String,
    label: "Provider Id",
    optional: true,
    autoValue: schemaIdAutoValue
  },
  name: {
    type: String,
    label: "Service Code",
    optional: true
  },
  label: {
    type: String,
    label: "Public Label"
  },
  enabled: {
    type: Boolean,
    defaultValue: true
  },
  serviceAuth: {
    type: String,
    label: "Auth",
    optional: true
  },
  serviceSecret: {
    type: String,
    label: "Secret",
    optional: true
  },
  serviceUrl: {
    type: String,
    label: "Service URL",
    optional: true
  },
  shippoProvider: {
    type: ShippoShippingProvider,
    optional: true
  }
}, { check, tracker: Tracker });

registerSchema("ShippingProvider", ShippingProvider);

/**
 * @name Shipping
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} _id optional
 * @property {String} shopId required
 * @property {String} name optional
 * @property {ShippingProvider} provider optional
 * @property {ShippingMethod[]} methods optional
 * @property {ShipmentQuote[]} shipmentQuotes optional
 */
export const Shipping = new SimpleSchema({
  "_id": {
    type: String,
    label: "Service Id",
    optional: true
  },
  "shopId": {
    type: String,
    index: 1,
    autoValue: shopIdAutoValue,
    label: "Shipping ShopId"
  },
  "name": {
    type: String,
    label: "Service Name",
    optional: true,
    index: 1
  },
  "provider": {
    type: ShippingProvider,
    label: "Shipping Provider"
  },
  "methods": {
    type: Array,
    optional: true,
    label: "Shipping Methods"
  },
  "methods.$": {
    type: ShippingMethod
  },
  "shipmentQuotes": {
    type: Array,
    optional: true,
    label: "Quoted Methods"
  },
  "shipmentQuotes.$": {
    type: ShipmentQuote
  }
}, { check, tracker: Tracker });

registerSchema("Shipping", Shipping);

/**
 * @name ShippingPackage
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} settings.name default value: `Flat Rate Service`
 */
export const ShippingPackageConfig = PackageConfig.clone().extend({
  // Remove blackbox: true from settings obj
  "settings": {
    type: Object,
    optional: true,
    blackbox: false,
    defaultValue: {}
  },
  "settings.name": {
    type: String,
    defaultValue: "Flat Rate Service"
  }
});

registerSchema("ShippingPackageConfig", ShippingPackageConfig);
