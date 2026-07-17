import * as system from "./_helpers.mjs";

import { PjSheet } from "./Actor/Sheet/PjSheet.mjs";
import { PnjSheet } from "./Actor/Sheet/PnjSheet.mjs";

import { ActorPjDataModel } from "./Actor/DataModel/ActorPjDataModel.mjs";
import { ActorPnjDataModel } from "./Actor/DataModel/ActorPnjDataModel.mjs";

import { ObjetSheet }       from "./Item/Sheet/ObjetSheet.mjs";
import { ArmeSheet }        from "./Item/Sheet/ArmeSheet.mjs";
import { ArmureSheet }      from "./Item/Sheet/ArmureSheet.mjs";
import { ConsommableSheet } from "./Item/Sheet/ConsommableSheet.mjs";
import { GlypheSheet }      from "./Item/Sheet/GlypheSheet.mjs";
import { FabricationSheet } from "./Item/Sheet/FabricationSheet.mjs";

import { ObjetDataModel } from "./Item/DataModel/ObjetDataModel.mjs";
import { ConsomableDataModel } from "./Item/DataModel/ConsomableDataModel.mjs";
import { ArmeDataModel } from "./Item/DataModel/ArmeDataModel.mjs";
import { ArmureDataModel } from "./Item/DataModel/ArmureDataModel.mjs";
import { GlypheDataModel } from "./Item/DataModel/GlypheDataModel.mjs";
import { FabricationDataModel } from "./Item/DataModel/FabricationDataModel.mjs";

import {registerFunctions as registerHandleBarFunctions} from "./SystemBase/Helpers/Handlebars.mjs";

import { ActionHeroiqueDataModel } from "./Effet/ActionHeroique/DataModel/ActionHeroiqueDataModel.mjs";
import { ActionHeroiqueSheet } from "./Effet/ActionHeroique/Sheet/ActionHeroiqueSheet.mjs";
import { MessageActionResolver } from "./SystemBase/ChatMessage/MessageActionResolver.mjs";
import { AptitudeAskMessage } from "./DiceRoller/Aptitude/AptitudeAskMessage.mjs";
import { ValeurDe } from "./Common/ValeurDe.mjs";


Hooks.once("init", () => {
  console.log(system.Consts.SYSTEMID + " | Initialisation du système " + system.Consts.SYSTEMID);
  system.Base.init();
  
  CONFIG.Actor.dataModels = {
    pj: ActorPjDataModel,
    pnj: ActorPnjDataModel,
  };
  
  CONFIG.Item.dataModels = {
    objet: ObjetDataModel,
    consommable: ConsomableDataModel,
    arme: ArmeDataModel,
    armure: ArmureDataModel,
    glyphe: GlypheDataModel,
    fabrication: FabricationDataModel
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

  foundry.documents.collections.Items.registerSheet("glyphes", ConsommableSheet, {
    types: ["consommable"],
    makeDefault: true,
    label: "Feuille de consommable"
  });

  foundry.documents.collections.Items.registerSheet("glyphes", ArmeSheet, {
    types: ["arme"],
    makeDefault: true,
    label: "Feuille d'arme"
  });

  foundry.documents.collections.Items.registerSheet("glyphes", ArmureSheet, {
    types: ["armure"],
    makeDefault: true,
    label: "Feuille d'armure"
  });

  foundry.documents.collections.Items.registerSheet("glyphes", GlypheSheet, {
    types: ["glyphe"],
    makeDefault: true,
    label: "Feuille de glyphe"
  });

  foundry.documents.collections.Items.registerSheet("glyphes", FabricationSheet, {
    types: ["fabrication"],
    makeDefault: true,
    label: "Feuille de fabrication"
  });
  
  foundry.applications.apps.DocumentSheetConfig.registerSheet(ActiveEffect, "glyphes", ActionHeroiqueSheet, {
    label: "Action Héroïque",
    types: ["actionHeroique"],
    makeDefault: true
  });

  system.Settings.fct.registerSettings();

  registerHandleBarFunctions();

  system.Actor.Events.register();

  system.DiceRoller.fct.registerDiceRolls();

  MessageActionResolver.register("lancerDeDemandeMJ", AptitudeAskMessage._onReponseDemandeMJ);

});


