import { Reaction } from "/server/api";


// Custom theme registering

Reaction.registerPackage({
  // Label that shows up in tooltips and places where the package is accessable for settings
  label: "Create-reaction-app theme",

  // Unique name, used for pulling package data out of the database
  name: "create-reaction-app",

  // Icon for toolbars
  icon: "fa fa-vine",

  // Auto-enable plugin, sets enabled: true in database
  autoEnable: true,

  // Settings for plugin
  settings: {},

  // Routes and other registry items related to layout
  registry: [
    {
      route: "/about",
      name: "about",
      template: "aboutUs",
      workflow: "coreWorkflow"
    }
  ]
});