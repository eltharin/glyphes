import * as system  from "../_helpers.mjs";

import { MessageActionResolver } from "../ChatMessage/MessageActionResolver.mjs";
import { AptitudeRoll } from "./Aptitude/AptitudeRoll.mjs";




export function registerDiceRolls() {
    CONFIG.Dice.rolls.push(AptitudeRoll);
}

export function registerMessageEventListener() {
    Hooks.on("renderChatMessageHTML", (message, html, data) => {
        html.querySelectorAll(".dice-roll button[data-action]").forEach(btn => {
            btn.addEventListener("click", event => {
                const action = event.currentTarget.dataset.action;
                MessageActionResolver.executeAction(action, event, message, data);
            });
        });

    });

    
}