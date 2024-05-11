// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Env from "../Env.mjs";
import * as Uuid from "uuid";
import * as Canvas from "canvas";
import * as Ethers from "ethers";
import * as Qrcode from "qrcode";
import * as Endpoints from "../Endpoints.mjs";
import * as Exceptions from "../Exceptions.mjs";
import * as Gist$Utils from "@brightidbot/utils/src/Gist.mjs";
import * as DiscordJs from "discord.js";
import * as Core__Promise from "@rescript/core/src/Core__Promise.mjs";
import * as Decode$Shared from "@brightidbot/shared/src/Decode.mjs";
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js";
import * as Constants$Shared from "@brightidbot/shared/src/Constants.mjs";
import * as Services_AppInfo from "../services/Services_AppInfo.mjs";
import * as Caml_js_exceptions from "rescript/lib/es6/caml_js_exceptions.js";
import * as Builders from "@discordjs/builders";
import * as Services_VerificationInfo from "../services/Services_VerificationInfo.mjs";

var abi = (import("../../../../packages/shared/src/abi/SP.json", {assert: {type: "json"}}).then((module) => module.default));

var Canvas$1 = {};

var QRCode = {};

Env.createEnv();

var config = Env.getConfig();

var envConfig;

if (config.TAG === "Ok") {
  envConfig = config._0;
} else {
  throw {
        RE_EXN_ID: Env.EnvError,
        _1: config._0,
        Error: new Error()
      };
}

function gistConfig() {
  return Gist$Utils.makeGistConfig(envConfig.gistId, "guildData.json", envConfig.githubAccessToken);
}

function addRoleToMember(guildRole, member) {
  var guildMemberRoleManager = member.roles;
  return guildMemberRoleManager.add(guildRole, undefined);
}

function embedFields(verifyUrl) {
  return [
          {
            name: "1. Get Verified in the BrightID app",
            value: "Getting verified requires you make connections with other trusted users. Given the concept is new and there are not many trusted users, this is currently being done through [Verification parties](https://www.brightid.org/meet) that are hosted in the BrightID server and require members join a voice/video call."
          },
          {
            name: "2. Type the `/verify` command in an appropriate channel",
            value: "You can type this command in any public channel with access to the BrightID Bot, like the official BrightID server which [you can access here](https://discord.gg/gH6qAUH)."
          },
          {
            name: "3. Scan the QR Code",
            value: "Open the BrightID app and scan the QR code. Mobile users can click [this link](" + verifyUrl + ")."
          }
        ];
}

function makeEmbed(fields) {
  return new DiscordJs.MessageEmbed().setColor("#fb8b60").setTitle("How To Get Verified with Bright ID").setURL("https://www.brightid.org/").setAuthor("BrightID Bot", "https://media.discordapp.net/attachments/708186850359246859/760681364163919994/1601430947224.png", "https://www.brightid.org/").setDescription("Here is a step-by-step guide to help you get verified with BrightID.").setThumbnail("https://media.discordapp.net/attachments/708186850359246859/760681364163919994/1601430947224.png").addFields(fields).setTimestamp().setFooter("Bot made by the Shenanigan team", "https://media.discordapp.net/attachments/708186850359246859/760681364163919994/1601430947224.png");
}

async function makeCanvasFromUri(uri) {
  var canvas = Canvas.default.createCanvas(700, 250);
  await Qrcode.toCanvas(canvas, uri);
  return canvas;
}

async function createMessageAttachmentFromCanvas(canvas) {
  return new DiscordJs.MessageAttachment(canvas.toBuffer(), "qrcode.png", undefined);
}

function getRolebyRoleId(guildRoleManager, roleId) {
  var guildRole = guildRoleManager.cache.get(roleId);
  if (!(guildRole == null)) {
    return guildRole;
  }
  throw {
        RE_EXN_ID: Exceptions.VerifyCommandError,
        _1: "Could not find a role with the id " + roleId,
        Error: new Error()
      };
}

function makeLinkActionRow(verifyUrl) {
  var mobileButton = new DiscordJs.MessageButton().setLabel("Open QRCode in the BrightID app").setStyle("LINK").setURL(verifyUrl);
  var roleButton = new DiscordJs.MessageButton().setCustomId("verify").setLabel("Click here after scanning QR Code in the BrightID app").setStyle("PRIMARY");
  return new DiscordJs.MessageActionRow().addComponents([
              roleButton,
              mobileButton
            ]);
}

function makeBeforeSponsorActionRow(customId, verifyUrl) {
  var sponsorButton = new DiscordJs.MessageButton().setCustomId(customId).setLabel("Click this after scanning QR code").setStyle("PRIMARY");
  var mobileButton = new DiscordJs.MessageButton().setLabel("Open QRCode in the BrightID app").setStyle("LINK").setURL(verifyUrl);
  return new DiscordJs.MessageActionRow().addComponents([
              sponsorButton,
              mobileButton
            ]);
}

function linkOptions(attachment, embed, row) {
  return {
          embeds: [embed],
          files: [attachment],
          ephemeral: true,
          components: [row]
        };
}

async function makeLinkOptions(uuid) {
  var uri = Endpoints.brightIdAppDeeplink + "/" + uuid;
  var verifyUrl = Endpoints.brightIdLinkVerificationEndpoint + "/" + uuid;
  var canvas = await makeCanvasFromUri(uri);
  var attachment = await createMessageAttachmentFromCanvas(canvas);
  var embed = makeEmbed(embedFields(verifyUrl));
  var row = makeLinkActionRow(verifyUrl);
  return linkOptions(attachment, embed, row);
}

async function unknownErrorMessage(interaction) {
  var options = {
    content: "An unknown error occurred. Please try again later.",
    ephemeral: true
  };
  return interaction.followUp(options);
}

async function beforeSponsorMessageOptions(customId, uuid) {
  var uri = Endpoints.brightIdAppDeeplink + "/" + uuid;
  var verifyUrl = Endpoints.brightIdLinkVerificationEndpoint + "/" + uuid;
  var canvas = await makeCanvasFromUri(uri);
  var attachment = await createMessageAttachmentFromCanvas(canvas);
  var row = makeBeforeSponsorActionRow(customId, verifyUrl);
  return {
          content: "Please scan this QR code in the BrightID app to link Discord. \n\n **__You can download the app on Android and iOS__** \n Android: <https://play.google.com/store/apps/details?id=org.brightid> \n\n iOS: <https://apps.apple.com/us/app/brightid/id1428946820> \n\n",
          files: [attachment],
          ephemeral: true,
          components: [row]
        };
}

var NoAvailableSP = /* @__PURE__ */Caml_exceptions.create("Commands_Verify.NoAvailableSP");

function totalUnusedSponsorships(usedSponsorships, assignedSponsorships, assignedSponsorshipsEth) {
  var totalAssignedSponsorships = assignedSponsorshipsEth.add(assignedSponsorships);
  var unusedSponsorships = totalAssignedSponsorships.sub(usedSponsorships);
  if (unusedSponsorships.lte(Ethers.constants.Zero)) {
    throw {
          RE_EXN_ID: NoAvailableSP,
          Error: new Error()
        };
  }
  return unusedSponsorships;
}

async function noSponsorshipsMessage(interaction) {
  var options = {
    content: "Whoops! You have not yet been sponsored. You can get sponsored from within the BrightID mobile app https://www.brightid.org/ \n\n ",
    ephemeral: true
  };
  return await interaction.followUp(options);
}

async function handleUnverifiedGuildMember(errorNum, interaction, uuid) {
  if (errorNum === 3 || errorNum === 2) {
    var options = await makeLinkOptions(uuid);
    await interaction.editReply(options);
    return ;
  }
  var options$1 = {
    content: "Something unexpected happened. Please try again later.",
    ephemeral: true
  };
  await interaction.editReply(options$1);
}

async function getAppUnusedSponsorships(context) {
  var data;
  try {
    data = await Services_AppInfo.getAppInfo(context);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === Exceptions.BrightIdError) {
      return ;
    }
    if (exn.RE_EXN_ID === "JsError") {
      return ;
    }
    throw exn;
  }
  return BigInt(data.unusedSponsorships);
}

function execute(interaction) {
  var guild = interaction.guild;
  var member = interaction.member;
  var guildRoleManager = guild.roles;
  var memberId = member.id;
  var uuid = Uuid.v5(memberId, envConfig.uuidNamespace);
  return Core__Promise.$$catch(interaction.deferReply({
                    ephemeral: true
                  }).then(function (param) {
                  return Gist$Utils.ReadGist.content(gistConfig(), Decode$Shared.Decode_Gist.brightIdGuilds).then(function (guilds) {
                              var guildId = guild.id;
                              var guildData = guilds[guildId];
                              if (guildData !== undefined) {
                                var roleId = guildData.roleId;
                                if (roleId !== undefined) {
                                  var guildRole = getRolebyRoleId(guildRoleManager, roleId);
                                  return Core__Promise.$$catch(Services_VerificationInfo.getBrightIdVerification(member).then(function (verificationInfo) {
                                                  if (verificationInfo._0.unique) {
                                                    return addRoleToMember(guildRole, member).then(function (param) {
                                                                var options = {
                                                                  content: "Hey, I recognize you! I just gave you the \`" + guildRole.name + "\` role. You are now BrightID verified in " + guild.name + " server!",
                                                                  ephemeral: true
                                                                };
                                                                return interaction.editReply(options).then(function (param) {
                                                                            return Promise.resolve();
                                                                          });
                                                              });
                                                  }
                                                  var options = {
                                                    content: "Hey, I recognize you, but your account seems to be linked to a sybil attack. You have multiple Discord accounts on the same BrightID. If this is a mistake, contact one of the support channels. ",
                                                    ephemeral: true
                                                  };
                                                  return interaction.editReply(options).then(function (param) {
                                                              return Promise.reject({
                                                                          RE_EXN_ID: Exceptions.VerifyCommandError,
                                                                          _1: "Commands_Verify: User with contextId: " + uuid + " is not unique "
                                                                        });
                                                            });
                                                }), (async function (e) {
                                                if (e.RE_EXN_ID === Exceptions.BrightIdError) {
                                                  var errorNum = e._1.errorNum;
                                                  var appUnusedSponsorships = await getAppUnusedSponsorships(Constants$Shared.context);
                                                  if (appUnusedSponsorships !== undefined) {
                                                    if (errorNum !== 4) {
                                                      var exit = 0;
                                                      var data;
                                                      try {
                                                        data = await handleUnverifiedGuildMember(errorNum, interaction, uuid);
                                                        exit = 1;
                                                      }
                                                      catch (raw_obj){
                                                        var obj = Caml_js_exceptions.internalToOCamlException(raw_obj);
                                                        if (obj.RE_EXN_ID === "JsError") {
                                                          console.error(obj._1);
                                                          throw {
                                                                RE_EXN_ID: Exceptions.VerifyCommandError,
                                                                _1: "Unknown JS Error",
                                                                Error: new Error()
                                                              };
                                                        }
                                                        throw obj;
                                                      }
                                                      exit === 1;
                                                      return ;
                                                    }
                                                    console.log("App Sponsorships left: ", appUnusedSponsorships.toString());
                                                    var options = await beforeSponsorMessageOptions("before-premium-sponsor", uuid);
                                                    await interaction.editReply(options);
                                                    return ;
                                                  }
                                                  await noSponsorshipsMessage(interaction);
                                                  throw {
                                                        RE_EXN_ID: Exceptions.VerifyCommandError,
                                                        _1: "Discord Bot has no available sponsorships",
                                                        Error: new Error()
                                                      };
                                                }
                                                throw e;
                                              }));
                                }
                                var options = {
                                  content: "Hi, sorry about that. I couldn't retrieve the data for this server from BrightID. Try reinviting the bot. \n\n **Note: This will create a new role BrightID Role.**"
                                };
                                return interaction.editReply(options).then(function (param) {
                                            return Promise.reject({
                                                        RE_EXN_ID: Exceptions.VerifyCommandError,
                                                        _1: "Guild does not have a saved roleId"
                                                      });
                                          });
                              }
                              var options$1 = {
                                content: "Hi, sorry about that. I couldn't retrieve the data for this server from BrightId"
                              };
                              return interaction.editReply(options$1).then(function (param) {
                                          return Promise.reject({
                                                      RE_EXN_ID: Exceptions.VerifyCommandError,
                                                      _1: "Guild could not be found in the database"
                                                    });
                                        });
                            });
                }), (function (prim) {
                return Promise.reject(prim);
              }));
}

var data = new Builders.SlashCommandBuilder().setName("verify").setDescription("Sends a BrightID QR code for users to connect with their BrightId");

var brightIdAppDeeplink = Endpoints.brightIdAppDeeplink;

var brightIdLinkVerificationEndpoint = Endpoints.brightIdLinkVerificationEndpoint;

var context = Constants$Shared.context;

var contractAddressID = Constants$Shared.contractAddressID;

var contractAddressETH = Constants$Shared.contractAddressETH;

export {
  brightIdAppDeeplink ,
  brightIdLinkVerificationEndpoint ,
  context ,
  contractAddressID ,
  contractAddressETH ,
  abi ,
  Canvas$1 as Canvas,
  QRCode ,
  envConfig ,
  gistConfig ,
  addRoleToMember ,
  embedFields ,
  makeEmbed ,
  makeCanvasFromUri ,
  createMessageAttachmentFromCanvas ,
  getRolebyRoleId ,
  makeLinkActionRow ,
  makeBeforeSponsorActionRow ,
  linkOptions ,
  makeLinkOptions ,
  unknownErrorMessage ,
  beforeSponsorMessageOptions ,
  NoAvailableSP ,
  totalUnusedSponsorships ,
  noSponsorshipsMessage ,
  handleUnverifiedGuildMember ,
  getAppUnusedSponsorships ,
  execute ,
  data ,
}
/* abi Not a pure module */
