import { SystemConsts } from "../SystemConsts.mjs";
import { DeckSacrificeConfig } from "./DeckSacrificeConfig.mjs";


export function registerSettings()
{
    game.settings.register(SystemConsts.SYSTEMID, "deckSacrifice", {
        name: "glyphes.settings.deckSacrifice.label",
        scope: "world",
        config: false,
        type: String,
        default: ""
    });

    game.settings.registerMenu(SystemConsts.SYSTEMID, "deckSacrifice", {
        name: "glyphes.settings.deckSacrifice.label",
        label: "glyphes.settings.deckSacrifice.btn",
        hint: "glyphes.settings.deckSacrifice.hint",
        scope: "world",
        restricted: true,
        type: DeckSacrificeConfig,
    });


    
    game.settings.register(SystemConsts.SYSTEMID, "tabAleatIdEvocationNonNefaste", {
        name: "glyphes.settings.evocation.nonnefaste.label",
        scope: "world",
        config: true,
        type: String,
        default: ""
    });

    
    game.settings.register(SystemConsts.SYSTEMID, "tabAleatIdEvocationNefaste", {
        name: "glyphes.settings.evocation.nefaste.label",
        scope: "world",
        config: true,
        type: String,
        default: ""
    });

    
    game.settings.register(SystemConsts.SYSTEMID, "tabAleatIdEvocationSendHidden", {
        name: "glyphes.settings.evocation.sendHidden.label",
        scope: "world",
        config: true,
        type: Boolean,
        default: ""
    });
}