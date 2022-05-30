// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Env from "./Env.mjs";
import * as Curry from "../../../node_modules/rescript/lib/es6/curry.js";
import * as DiscordJs from "discord.js";
import * as Commands_Help from "./commands/Commands_Help.mjs";
import * as Commands_Role from "./commands/Commands_Role.mjs";
import * as Buttons_Verify from "./buttons/Buttons_Verify.mjs";
import * as Commands_Guild from "./commands/Commands_Guild.mjs";
import * as Caml_exceptions from "../../../node_modules/rescript/lib/es6/caml_exceptions.js";
import * as Commands_Invite from "./commands/Commands_Invite.mjs";
import * as Commands_Verify from "./commands/Commands_Verify.mjs";
import * as UpdateOrReadGistMjs from "./updateOrReadGist.mjs";

var RequestHandlerError = /* @__PURE__ */Caml_exceptions.create("Bot.RequestHandlerError");

function updateGist(prim0, prim1) {
  return UpdateOrReadGistMjs.updateGist(prim0, prim1);
}

Env.createEnv(undefined);

var config = Env.getConfig(undefined);

var options = {
  intents: [
    "GUILDS",
    "GUILD_MESSAGES"
  ]
};

var client = new DiscordJs.Client(options);

var commands = new DiscordJs.Collection();

var buttons = new DiscordJs.Collection();

commands.set(Commands_Help.data.name, {
              data: Commands_Help.data,
              execute: Commands_Help.execute
            }).set(Commands_Verify.data.name, {
            data: Commands_Verify.data,
            execute: Commands_Verify.execute
          }).set(Commands_Role.data.name, {
          data: Commands_Role.data,
          execute: Commands_Role.execute
        }).set(Commands_Invite.data.name, {
        data: Commands_Invite.data,
        execute: Commands_Invite.execute
      }).set(Commands_Guild.data.name, {
      data: Commands_Guild.data,
      execute: Commands_Guild.execute
    });

buttons.set(Buttons_Verify.customId, {
      customId: Buttons_Verify.customId,
      execute: Buttons_Verify.execute
    });

function updateGistOnGuildCreate(guild) {
  return UpdateOrReadGistMjs.updateGist(guild.id, {
              name: guild.name,
              role: "Verified"
            });
}

function onGuildCreate(guild) {
  var roleManager = guild.roles;
  roleManager.create({
        name: "Verified",
        color: "ORANGE",
        reason: "Create a role to mark verified users with BrightID"
      });
  updateGistOnGuildCreate(guild);
  
}

function onInteraction(interaction) {
  var isCommand = interaction.isCommand();
  var isButton = interaction.isButton();
  if (isCommand) {
    if (isButton) {
      console.error("Bot.res: Unknown interaction");
      return ;
    }
    var commandName = interaction.commandName;
    var command = commands.get(commandName);
    if (command == null) {
      console.error("Bot.res: Command not found");
    } else {
      Curry._1(command.execute, interaction);
    }
    return ;
  }
  if (isButton) {
    var buttonCustomId = interaction.customId;
    var button = buttons.get(buttonCustomId);
    if (button == null) {
      console.error("Bot.res: Button not found");
    } else {
      Curry._1(button.execute, interaction);
    }
    return ;
  }
  console.error("Bot.res: Unknown interaction");
  
}

client.on("ready", (function (param) {
        console.log("Logged In");
        
      }));

client.on("guildCreate", onGuildCreate);

client.on("interactionCreate", onInteraction);

if (config.TAG === /* Ok */0) {
  client.login(config._0.discordApiToken);
} else {
  console.log(config._0);
}

export {
  RequestHandlerError ,
  updateGist ,
  config ,
  options ,
  client ,
  commands ,
  buttons ,
  updateGistOnGuildCreate ,
  onGuildCreate ,
  onInteraction ,
  
}
/*  Not a pure module */
