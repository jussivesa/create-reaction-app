jest.mock("/imports/plugins/core/ui/client/components", () => ({
  Badge() { return null; },
  ClickToCopy() { return null; }
}));

import React from "react";
import { shallow } from "enzyme";
import shallowToJSON from "enzyme-to-json";
import OrderSummary from "../../components/orderSummary";

/**
 * Order Summary is a display only component
 * It receives props and displays them accordingly
 */

afterEach(() => {
  jest.clearAllMocks();
});

/**
 * Snapshots make sure your UI does not change unexpectedly
 */

test("OrderSummary snapshot test", () => {
  // Initializing all the props passed into order summary component
  const dateFormat = jest.fn();
  const tracking = jest.fn();
  const shipmentStatus = jest.fn(() => ({}));
  const printableLabels = jest.fn(() => ({}));
  const profileShippingAddress = {};
  const order = {
    shipping: [{ shipmentMethod: {} }],
    workflow: {
      status: "new"
    },
    billing: [
      {
        paymentMethod: {},
        invoice: {}
      }
    ]
  };

  const component = shallow((
    <OrderSummary
      dateFormat={dateFormat}
      tracking={tracking}
      profileShippingAddress={profileShippingAddress}
      shipmentStatus={shipmentStatus}
      printableLabels={printableLabels}
      order={order}
    />
  ));
  const tree = shallowToJSON(component);
  expect(tree).toMatchSnapshot();
});
