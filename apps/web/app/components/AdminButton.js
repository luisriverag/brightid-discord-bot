// Generated by ReScript, PLEASE EDIT WITH CARE

import * as React from "react";
import * as React$1 from "@remix-run/react";

function AdminButton(props) {
  return React.createElement(React$1.Link, {
              prefetch: "intent",
              to: "/guilds/" + props.guildId + "/admin",
              children: React.createElement("button", {
                    className: "p-4 bg-transparent border-2 border-brightid font-semibold rounded-3xl text-large text-white"
                  }, "Admin Settings")
            });
}

var make = AdminButton;

export {
  make ,
}
/* react Not a pure module */
