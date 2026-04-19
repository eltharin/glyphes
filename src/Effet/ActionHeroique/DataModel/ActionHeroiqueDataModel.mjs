import * as system from "../../../_helpers.mjs";

export class ActionHeroiqueDataModel  extends system.Models.SystemDataModel {
  constructor(data, options) {
    super(data, options);
  }

  static defineSchema() {
    return {
      effet: new foundry.data.fields.StringField({}),
      cout: new foundry.data.fields.NumberField({initial: 1}),
    };
  }

  prepareDerivedData() {
      
  }
}