import * as system from "./_helpers.mjs";

import { PjSheet } from "./Actor/Sheet/PjSheet.mjs";
import { PnjSheet } from "./Actor/Sheet/PnjSheet.mjs";

import { ActorPjDataModel } from "./Actor/DataModel/ActorPjDataModel.mjs";
import { ActorPnjDataModel } from "./Actor/DataModel/ActorPnjDataModel.mjs";

import { ObjetSheet } from "./Item/Sheet/ObjetSheet.mjs";

import { ObjetDataModel } from "./Item/DataModel/ObjetDataModel.mjs";
import { ConsomableDataModel } from "./Item/DataModel/ConsomableDataModel.mjs";
import { ArmeDataModel } from "./Item/DataModel/ArmeDataModel.mjs";
import { ArmureDataModel } from "./Item/DataModel/ArmureDataModel.mjs";

import {registerFunctions as registerHandleBarFunctions} from "./Handlebars.mjs"

import { ActionHeroiqueDataModel } from "./Effet/ActionHeroique/DataModel/ActionHeroiqueDataModel.mjs";
import { ActionHeroiqueSheet } from "./Effet/ActionHeroique/Sheet/ActionHeroiqueSheet.mjs";


Hooks.once("init", () => {
  console.log(system.Consts.SYSTEMID + " | Initialisation du système " + system.Consts.SYSTEMID);

  CONFIG.Actor.dataModels = {
    pj: ActorPjDataModel,
    pnj: ActorPnjDataModel,
  };
  
  CONFIG.Item.dataModels = {
    objet: ObjetDataModel,
    consommable: ConsomableDataModel,
    arme: ArmeDataModel,
    armure: ArmureDataModel,
  };
  
  CONFIG.ActiveEffect.dataModels = {
    actionHeroique: ActionHeroiqueDataModel
  };
  
  foundry.documents.collections.Actors.registerSheet(system.Consts.SYSTEMID, PjSheet, {
    types: ["pj"],
    makeDefault: true,
    label: "Feuille de Personnage Joueur"
  });
  foundry.documents.collections.Actors.registerSheet(system.Consts.SYSTEMID, PnjSheet, {
    types: ["pnj"],
    makeDefault: true,
    label: "Feuille de Personnage Non Joueur"
  });
  foundry.documents.collections.Items.registerSheet(system.Consts.SYSTEMID, ObjetSheet, {
    types: ["objet"],
    makeDefault: true,
    label: "Feuille d'objet"
  });

  foundry.documents.collections.Items.registerSheet("glyphes", ObjetSheet, {
    types: ["consommable"],
    makeDefault: true,
    label: "Feuille de consommable"
  });

  foundry.documents.collections.Items.registerSheet("glyphes", ObjetSheet, {
    types: ["arme"],
    makeDefault: true,
    label: "Feuille d'arme"
  });

  foundry.documents.collections.Items.registerSheet("glyphes", ObjetSheet, {
    types: ["armure"],
    makeDefault: true,
    label: "Feuille d'armure"
  });
  
  foundry.applications.apps.DocumentSheetConfig.registerSheet(ActiveEffect, "glyphes", ActionHeroiqueSheet, {
    label: "Action Héroïque",
    types: ["actionHeroique"],
    makeDefault: true
  });

  system.Settings.fct.registerSettings();

  registerHandleBarFunctions();

  system.DiceRoller.fct.registerMessageEventListener();
  system.Actor.Events.register();

  system.DiceRoller.fct.registerDiceRolls();
});


Handlebars.registerHelper("callMethod", function(obj, methodName, ...args) {
  console.log(obj, methodName, args);
  if (obj && typeof obj[methodName] === "function") {
    console.log("Appel de la méthode " + methodName + " avec les arguments : ", args, obj[methodName](...args));
    return obj[methodName](...args);
  }
  return "";
});