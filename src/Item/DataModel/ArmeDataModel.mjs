import * as system from "../../_helpers.mjs";
import { BaseObjetDataModel } from "./BaseObjetDataModel.mjs";



export class ArmeDataModel extends BaseObjetDataModel {

    static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/arme.svg";

    static defineSchema() {
        return {
            ...super.defineSchema(),
            aptitude: new foundry.data.fields.StringField({initial: ""}),
        };
    }
}