import React from "react";
import { shallow } from "enzyme";
import shallowToJSON from "enzyme-to-json";
import Translation from "../translation";

jest.mock("/client/api", () => ({
  i18next: {
    t: (key, { defaultValue }) => defaultValue || key
  }
}));


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

test("Translation snapshot test", () => {
  const component = shallow((
    <Translation
      defaultValue="Translated Text"
      i18nKey={"path.to.key"}
    />
  ));
  const tree = shallowToJSON(component);
  expect(tree).toMatchSnapshot();
});
