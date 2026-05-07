import * as system from "../../_helpers.mjs";
import { BaseObjetDataModel } from "./BaseObjetDataModel.mjs";



export class ArmureDataModel extends BaseObjetDataModel {

    static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/armure.svg";

    static defineSchema() {
        return {
            ...super.defineSchema(),
            isBouclier: new foundry.data.fields.BooleanField({initial: false}),
        };
    }
}