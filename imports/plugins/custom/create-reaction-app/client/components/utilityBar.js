import React from "react";
import { Components } from "@reactioncommerce/reaction-components";
import _ from "lodash";

const UtilityBar = (props, context) => {
  const visibility = {
    hamburger: false,
    brand: false,
    tags: false,
    search: false,
    notifications: false,
    languages: true,
    currency: false,
    mainDropdown: true,
    cartContainer: false
  };
  const newProps = {
    ...props,
    visibility
  };
  const greetings = [
    "Hello!",
    "Hola!",
    "Grüetzi!",
    "Hallo!"
  ]
  return (
    <div className={"utility-bar"}>
      <div className={"utility-bar-hashtag"}>{"#VASIOS"}</div>
      <div className={"utility-bar-news"}>
        <p>{_.sample(greetings)}</p>
      </div>
      <div className={"utility-bar__main"}>
        {React.createElement(Components.NavBar, newProps, context)}
      </div>
    </div>
  );
};

export default UtilityBar;
