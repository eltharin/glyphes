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
}