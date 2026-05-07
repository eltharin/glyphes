import * as system from "../../_helpers.mjs";
import { BaseItemDataModel } from "./BaseItemDataModel.mjs";



export class FabricationDataModel extends BaseItemDataModel {

    static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/fabrication.svg";

    static defineSchema() {
        return {
            ...super.defineSchema(),
            zone: new foundry.data.fields.StringField({initial: "unique"}),
            duree: new foundry.data.fields.StringField({initial: "instant"}),
            temps: new foundry.data.fields.StringField({initial: "activitec"}),
            magnitude: new foundry.data.fields.StringField({initial: "commun"}),
        };
    }
}