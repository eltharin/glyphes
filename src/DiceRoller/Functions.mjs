import * as system  from "../_helpers.mjs";

import { AptitudeRoll } from "./Aptitude/AptitudeRoll.mjs";
import { AptitudeAskMessage } from "./Aptitude/AptitudeAskMessage.mjs";




export function registerDiceRolls() {
    CONFIG.Dice.rolls.push(AptitudeRoll);
    CONFIG.Dice.rolls.push(AptitudeAskMessage);
}

