import * as system  from "../_helpers.mjs";

import { AptitudeRoll } from "./Aptitude/AptitudeRoll.mjs";




export function registerDiceRolls() {
    CONFIG.Dice.rolls.push(AptitudeRoll);
}

