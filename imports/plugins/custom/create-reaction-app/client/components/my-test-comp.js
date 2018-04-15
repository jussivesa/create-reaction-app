import React, { Component } from "react";
import { registerComponent } from "/imports/plugins/core/layout/lib/components"

// Create a react component
class MyTestComp extends Component {
  render() {
    return (
      <div>
        {" My Test Comp"}
      </div>
    )
  }
}

// Register react component.
// Now MyTestComp can be accessed anywhere on the client with the name "my-react-component"
registerComponent({
  name: "my-test-comp",
  component: MyTestComp
});