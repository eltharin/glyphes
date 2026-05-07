import * as system from "../../_helpers.mjs";
import { BaseItemDataModel } from "./BaseItemDataModel.mjs";



export class BaseObjetDataModel extends BaseItemDataModel {
  static defineSchema() {
    return {
        ...super.defineSchema(),
        prix: new foundry.data.fields.NumberField({initial: 0, min:0}),
        isEncombrant: new foundry.data.fields.BooleanField({initial: false}),
    };
  }

}