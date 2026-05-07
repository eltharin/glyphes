import * as system  from "../../_helpers.mjs";

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class ArmeSheet extends BaseItemSheet {
  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/item/baseTemplate.hbs",
    },
    main: {
      template: system.Consts.TEMPLATES_PATH + "/item/arme.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    }
  };

  static TABS = {
    sheet: {
      tabs: [
        { id: "main", label: system.Consts.SYSTEMID + ".sheet.item.nav.main"},
      ],
      initial: "main",
    }
  };


  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    position: {
      width: 790,
      height: 360,
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options);
    context.prix = system.Common.Argent.convertAtoB(this.document.system.prix);

    context.lists = {
      aptitudes: system.Common.Aptitudes.categories["martiales"],
    }

    return context;
  }
  

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);
    foundry.utils.setProperty(data, "system.prix", system.Common.Argent.convertBtoA(submitData.prix));

    return data ; 
  }
  
}