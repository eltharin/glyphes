import * as system  from "../../_helpers.mjs";


export class BaseItemSheet extends system.Base.BaseSheet(
  foundry.applications.sheets.ItemSheetV2
) {

  static PARTIALS = {
    prix: system.Consts.TEMPLATES_PATH + "/shared/prixdefaut.hbs",
    encombrant: system.Consts.TEMPLATES_PATH + "/shared/encombrant.hbs",
    notes: system.Consts.TEMPLATES_PATH + "/shared/notes.hbs",
  };

  static DEFAULT_OPTIONS = {
    classes: [...super.DEFAULT_OPTIONS.classes??[], "glyphes-sheet", "glyphes-item-sheet"],
    position: {
      width: 770,
      height: 550,
    },
  }
  
}