import { BaseSheet } from "../../Models/Sheet/BaseSheet.mjs";


export class BaseItemSheet extends BaseSheet(
  foundry.applications.sheets.ItemSheetV2
) {

  static DEFAULT_OPTIONS = {
    classes: [""],
    position: {
      width: 770,
      height: 550,
    },
  }
  
}