// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Env from "../Env.mjs";
import * as Endpoints from "../Endpoints.mjs";
import * as Exceptions from "../Exceptions.mjs";
import NodeFetch from "node-fetch";
import * as Core__Promise from "@rescript/core/src/Core__Promise.mjs";
import * as Decode$Shared from "@brightidbot/shared/src/Decode.mjs";
import * as Constants$Shared from "@brightidbot/shared/src/Constants.mjs";
import * as Caml_js_exceptions from "rescript/lib/es6/caml_js_exceptions.js";
import * as Json$JsonCombinators from "@glennsl/rescript-json-combinators/src/Json.mjs";
import * as Json_Decode$JsonCombinators from "@glennsl/rescript-json-combinators/src/Json_Decode.mjs";

var UUID = {};

Env.createEnv(undefined);

var config = Env.getConfig(undefined);

var config$1;

if (config.TAG === /* Ok */0) {
  config$1 = config._0;
} else {
  throw {
        RE_EXN_ID: Env.EnvError,
        _1: config._0,
        Error: new Error()
      };
}

function fetchAppInformation(retryOpt, context) {
  var retry = retryOpt !== undefined ? retryOpt : 5;
  var endpoint = "" + Endpoints.brightIdAppsEndpoint + "/" + context + "";
  var params = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    timestamp: 60000
  };
  return Core__Promise.$$catch(NodeFetch(endpoint, params).then(function (prim) {
                    return prim.json();
                  }).then(function (json) {
                  var match = Json$JsonCombinators.decode(json, Decode$Shared.Decode_BrightId.App.data);
                  var match$1 = Json$JsonCombinators.decode(json, Decode$Shared.Decode_BrightId.$$Error.data);
                  if (match.TAG === /* Ok */0) {
                    return Promise.resolve(match._0.data);
                  } else if (match$1.TAG === /* Ok */0) {
                    return Promise.reject({
                                RE_EXN_ID: Exceptions.BrightIdError,
                                _1: match$1._0
                              });
                  } else {
                    return Promise.reject({
                                RE_EXN_ID: Json_Decode$JsonCombinators.DecodeError,
                                _1: match._0
                              });
                  }
                }), (function (e) {
                var retry$1 = retry - 1 | 0;
                if (retry$1 !== 0) {
                  return fetchAppInformation(retry$1, context);
                }
                var val;
                try {
                  val = e;
                }
                catch (raw_error){
                  var error = Caml_js_exceptions.internalToOCamlException(raw_error);
                  if (error.RE_EXN_ID === Exceptions.BrightIdError) {
                    return Promise.reject({
                                RE_EXN_ID: Exceptions.BrightIdError,
                                _1: error._1
                              });
                  }
                  if (error.RE_EXN_ID === "JsError") {
                    return Promise.reject({
                                RE_EXN_ID: "JsError",
                                _1: error._1
                              });
                  }
                  throw error;
                }
                throw e;
              }));
}

function getAppInfo(context) {
  return fetchAppInformation(undefined, context);
}

var context = Constants$Shared.context;

var brightIdAppsEndpoint = Endpoints.brightIdAppsEndpoint;

var verificationPollingEvery = 3000;

var requestTimeout = 60000;

export {
  context ,
  brightIdAppsEndpoint ,
  UUID ,
  config$1 as config,
  verificationPollingEvery ,
  requestTimeout ,
  fetchAppInformation ,
  getAppInfo ,
}
/*  Not a pure module */
