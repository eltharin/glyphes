import * as system  from "../../../_helpers.mjs";
import { BaseSheet } from "../../../Models/_helpers.mjs";


export class ActionHeroiqueSheet extends BaseSheet(
  foundry.applications.sheets.ActiveEffectConfig
) {
  static TABS= {};

  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/effet/actionHeroique/form.hbs",
    },
  };

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    },
    classes: ["beryllium-sheet"],
    actions: {

    },
    position: {
      width: 770,
      height: 550,
    },
    window: {
      resizable: true,
      controls: [

      ]
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)
    context.system = this.document.system;


    return context
  }
/*
  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);


    return data ; 
  }*/
}