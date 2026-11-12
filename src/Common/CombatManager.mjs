import * as system  from "../_helpers.mjs";
import { CombatObjectif } from "./Combat/Objectifs/CombatObjectif.mjs";
import { CombatObjectifsManager } from "./Combat/Objectifs/CombatObjectifsManager.mjs";


export class CombatManager {
    //static FLAG_REACTION = 


    //static getNbPaStart() {  return 4; }
    //static getFlagPa() {  return "flags.glyphes.combat.pa"; }

    static init() {
       /* Hooks.on("renderChatMessageHTML", (message, html, data) => {
            if(message.flags.dystopia?.attaqueMessage) {
                html.innerHTML = "<div>" + message.id + "</div>" + "<div>" + message.flags.dystopia.attaqueMessage.id + "</div>" + html.innerHTML;
                return html;
            }
        });*/

        CombatObjectifsManager.init();


/*
        Hooks.on("preUpdateCombat", (combat, change) => {
            if (!("round" in change)) return;
            if (combat.round >= change.round) return;

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ alias: "" }),
                content: "nouveau tour : " + change.round
            });

            [...combat.combatants].forEach(c => c.update({[CombatManager.getFlagPa()]: CombatManager.getNbPaStart()}));
        });
*/

    }  
}