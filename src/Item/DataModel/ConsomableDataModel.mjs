import * as system from "../../_helpers.mjs";
import { BaseObjetDataModel } from "./BaseObjetDataModel.mjs";



export class ConsomableDataModel extends BaseObjetDataModel {

    static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/consommable.svg";

    static defineSchema() {
        return {
            ...super.defineSchema(),
            qte: new foundry.data.fields.NumberField({initial: 1, min:0}),

        };
    }
}