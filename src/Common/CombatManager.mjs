import * as system  from "../_helpers.mjs";

import { CombatObjectifsManager } from "./Combat/Objectifs/CombatObjectifsManager.mjs";


export class CombatManager {

    static init() {

        CombatObjectifsManager.init();
    }  
}