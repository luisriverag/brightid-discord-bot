// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "../../../node_modules/rescript/lib/es6/curry.js";
import Isbot from "isbot";
import * as React from "react";
import * as Stream from "stream";
import * as Belt_Option from "../../../node_modules/rescript/lib/es6/belt_Option.js";
import * as Caml_option from "../../../node_modules/rescript/lib/es6/caml_option.js";
import * as React$1 from "@remix-run/react";
import * as Server from "react-dom/server";

var ResponseInit = {};

var BodyInit = {};

var ReactDOMServer = {};

function $$default(request, responseStatusCode, responseHeaders, remixContext) {
  var maybeCallbackName = Belt_Option.map(Belt_Option.map(Caml_option.null_to_opt(request.headers.get("User-Agent")), (function (prim) {
              return Isbot(prim);
            })), (function (onAllReady) {
          if (onAllReady) {
            return "onAllReady";
          } else {
            return "onShellReady";
          }
        }));
  return new Promise((function (resolve, reject) {
                var onAllReadyOptions = function (pipe) {
                  var callbackFn = function (param) {
                    var body = new Stream.PassThrough();
                    request.headers.set("Content-Type", "text/html");
                    var response = new Response(body, {
                          status: responseStatusCode,
                          headers: responseHeaders
                        });
                    resolve(response);
                    Curry._1(pipe, body);
                  };
                  return {
                          onAllReady: callbackFn,
                          onShellError: (function (err) {
                              reject(err);
                            }),
                          onError: (function (err) {
                              console.error(err);
                            })
                        };
                };
                var onShellReadyOptions = function (pipe) {
                  var callbackFn = function (param) {
                    var body = new Stream.PassThrough();
                    request.headers.set("Content-Type", "text/html");
                    var response = new Response(body, {
                          status: responseStatusCode,
                          headers: responseHeaders
                        });
                    resolve(response);
                    Curry._1(pipe, body);
                  };
                  return {
                          onShellReady: callbackFn,
                          onShellError: (function (err) {
                              reject(err);
                            }),
                          onError: (function (err) {
                              console.error(err);
                            })
                        };
                };
                if (Belt_Option.getWithDefault(maybeCallbackName, "") === "onAllReady") {
                  var allStream = Server.renderToPipeableStream(React.createElement(React$1.RemixServer, {
                            context: remixContext,
                            url: request.url
                          }), onAllReadyOptions(allStream.pipe));
                  setTimeout(allStream.abort, 5000);
                  return ;
                }
                if (Belt_Option.getWithDefault(maybeCallbackName, "") !== "onShellReady") {
                  return ;
                }
                var match = Server.renderToPipeableStream(React.createElement(React$1.RemixServer, {
                          context: remixContext,
                          url: request.url
                        }), onShellReadyOptions(pipe));
                setTimeout(match.abort, 5000);
              }));
}

export {
  ResponseInit ,
  BodyInit ,
  ReactDOMServer ,
  $$default ,
  $$default as default,
}
/* isbot Not a pure module */
