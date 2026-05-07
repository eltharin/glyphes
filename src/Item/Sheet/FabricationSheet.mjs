import * as system  from "../../_helpers.mjs";

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class FabricationSheet extends BaseItemSheet {
  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/item/baseTemplate.hbs",
    },
    main: {
      template: system.Consts.TEMPLATES_PATH + "/item/fabrication.hbs",
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
    context.lists = {
      zones: system.Common.FabricationComposant.zone,
      durees: system.Common.FabricationComposant.duree,
      tempss: system.Common.FabricationComposant.temps,
      magnitudes: system.Common.FabricationComposant.magnitude,
    }

    return context;
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    //foundry.utils.setProperty(data, "system.prixmoyen", system.Common.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }
  
}