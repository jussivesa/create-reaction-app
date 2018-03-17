import { Security } from "meteor/ongoworks:security";
import { Roles } from "meteor/alanning:roles";
import * as Collections from "/lib/collections";
import { Reaction, Hooks } from "/server/api";

const {
  Accounts,
  Cart,
  Packages,
  Emails,
  Jobs,
  MediaRecords,
  Orders,
  Products,
  Shipping,
  Shops,
  Tags,
  Templates,
  Translations
} = Collections;

/**
 * security definitions
 *
 * The following security definitions use the ongoworks:security package.
 * Rules within a single chain stack with AND relationship. Multiple
 * chains for the same collection stack with OR relationship.
 * See https://github.com/ongoworks/meteor-security
 *
 * It"s important to note that these security rules are for inserts,
 * updates, and removes initiated from untrusted (client) code.
 * Thus there may be other actions that certain roles are allowed to
 * take, but they do not necessarily need to be listed here if the
 * database operation is executed in a server method.
 */

export default function () {
  /*
   * Define some additional rule chain methods
   */

  Security.defineMethod("ifHasRoleForActiveShop", {
    fetch: [],
    transform: null,
    allow(type, arg, userId) {
      if (!arg) throw new Error("ifHasRole security rule method requires an argument");
      if (arg.role) {
        // Note: userId is passed to getShopId to ensure that it returns the correct shop based on the User Preference
        // if not passed, getShopId can default to primaryShopId if Meteor.userId is not available in the context the code is run
        return Roles.userIsInRole(userId, arg.role, Reaction.getShopId(userId));
      }
      return Roles.userIsInRole(userId, arg);
    }
  });

  // use this rule for collections other than Shops
  // matches this.shopId
  Security.defineMethod("ifShopIdMatches", {
    fetch: [],
    deny(type, arg, userId, doc) {
      // Note: userId is passed to getShopId to ensure that it returns the correct shop based on the User Preference
      // if not passed, getShopId can default to primaryShopId if Meteor.userId is not available in the context the code is run
      return doc.shopId !== Reaction.getShopId(userId);
    }
  });
  // this rule is for the Shops collection
  // use ifShopIdMatches for match on this._id
  Security.defineMethod("ifShopIdMatchesThisId", {
    fetch: [],
    deny(type, arg, userId, doc) {
      // Note: userId is passed to getShopId to ensure that it returns the correct shop based on the User Preference
      // if not passed, getShopId can default to primaryShopId if Meteor.userId is not available in the context the code is run
      return doc._id !== Reaction.getShopId(userId);
    }
  });

  Security.defineMethod("ifFileBelongsToShop", {
    fetch: [],
    deny(type, arg, userId, doc) {
      // Note: userId is passed to getShopId to ensure that it returns the correct shop based on the User Preference
      // if not passed, getShopId can default to primaryShopId if Meteor.userId is not available in the context the code is run
      return doc.metadata.shopId !== Reaction.getShopId(userId);
    }
  });

  Security.defineMethod("ifUserIdMatches", {
    fetch: [],
    deny(type, arg, userId, doc) {
      return (userId && doc.userId && doc.userId !== userId) || (doc.userId && !userId);
    }
  });

  Security.defineMethod("ifUserIdMatchesProp", {
    fetch: [],
    deny(type, arg, userId, doc) {
      return doc[arg] !== userId;
    }
  });

  // todo do we need this?
  Security.defineMethod("ifSessionIdMatches", {
    fetch: [],
    deny(type, arg, userId, doc) {
      return doc.sessionId !== Reaction.sessionId;
    }
  });

  /**
   * Define all security rules
   */

  /**
   * admin security
   * Permissive security for users with the "admin" role
   */

  Security.permit(["insert", "update", "remove"])
    .collections([Accounts, Products, Tags, Translations, Shipping, Orders, Packages, Templates, Jobs])
    .ifHasRoleForActiveShop({ role: "admin" })
    .ifShopIdMatches()
    .exceptProps(["shopId"])
    .allowInClientCode();

  /*
   * Permissive security for users with the "admin" role for FS.Collections
   */

  Security.permit(["insert", "update", "remove"])
    .collections([MediaRecords])
    .ifHasRoleForActiveShop({ role: ["admin", "owner", "createProduct"] })
    .ifFileBelongsToShop();

  /*
   * Users with the "admin" or "owner" role may update and
   * remove their shop but may not insert one.
   */

  Shops.permit(["update", "remove"])
    .ifHasRoleForActiveShop({ role: ["admin", "owner", "shopSettings"] })
    .ifShopIdMatchesThisId()
    .allowInClientCode();

  /*
   * Users with the "admin" or "owner" role may update and
   * remove products, but createProduct allows just for just a product editor
   */

  Products.permit(["insert", "update", "remove"])
    .ifHasRoleForActiveShop({ role: ["createProduct"] })
    .ifShopIdMatches()
    .allowInClientCode();

  /*
   * Users with the "owner" role may remove orders for their shop
   */

  Orders.permit("remove")
    .ifHasRoleForActiveShop({ role: ["admin", "owner"] })
    .ifShopIdMatches()
    .exceptProps(["shopId"])
    .allowInClientCode();

  /*
   * Can update cart from client. Must insert/remove carts using
   * server methods.
   * Can update all session carts if not logged in or user cart if logged in as that user
   * XXX should verify session match, but doesn't seem possible? Might have to move all cart updates to server methods, too?
   */

  Cart.permit(["insert", "update", "remove"])
    .ifHasRoleForActiveShop({ role: ["anonymous", "guest"] })
    .ifShopIdMatches()
    .ifUserIdMatches()
    .ifSessionIdMatches()
    .allowInClientCode();

  /*
   * Users may update their own account
   */
  Collections.Accounts.permit(["insert", "update"])
    .ifHasRoleForActiveShop({ role: ["anonymous", "guest"] })
    .ifUserIdMatches()
    .allowInClientCode();

  /**
   * Emails - Deny all client side ops
   */
  Emails.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
  });

  // As the above security Rules definitions happen after all known Core Initialization Event hooks,
  // Event hook to run after security rules are initialized. Use this hook to add security via a plugin
  Hooks.Events.run("afterSecurityInit");
}
