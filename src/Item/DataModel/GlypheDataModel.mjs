import * as system from "../../_helpers.mjs";
import { BaseItemDataModel } from "./BaseItemDataModel.mjs";



export class GlypheDataModel extends BaseItemDataModel {

    static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/glyphe.svg";

    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new foundry.data.fields.StringField({initial: ""}),
        };
    }
}