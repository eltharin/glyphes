import * as system  from "../../_helpers.mjs";
import { Races } from "../../Common/Races.mjs";
import { ValeurDe } from "../../Common/ValeurDe.mjs";
import { AptitudeRoller } from "../../DiceRoller/Aptitude/AptitudeRoller.mjs";
import { BaseSheet } from "../../Models/Sheet/BaseSheet.mjs";


export class BaseActorSheet extends BaseSheet (
  foundry.applications.sheets.ActorSheetV2
) {

  static PARTIALS = {
    sidebar: system.Consts.TEMPLATES_PATH + "/actor/parts/sidebar.hbs",
    topbar: system.Consts.TEMPLATES_PATH + "/actor/parts/topbar.hbs",
  };

  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/actor/pj/pj-sheet.hbs",
      templates: [
        "sidebar",
        "topbar",
      ]
    },
    main: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/perso.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    aptitudes: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/aptitudes.hbs",
      container: { id: "form" , element: ".tabscontainer" },
      scrollable: [".tabscontainer"]
    },
    combat: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/combat.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    evocation: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/evocation.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    fabrication: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/fabrication.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    inventaire: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/inventaire.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
  };

  static TABS = {
    sheet: {
      tabs: [
        {id: "main", label:"glyphes.sheet.actor.tabs.main"},
        {id: "aptitudes", label:"glyphes.sheet.actor.tabs.aptitudes"},
        {id: "combat", label:"glyphes.sheet.actor.tabs.combat"},
        {id: "evocation", label:"glyphes.sheet.actor.tabs.evocation"},
        {id: "fabrication", label:"glyphes.sheet.actor.tabs.fabrication"},
        {id: "inventaire", label:"glyphes.sheet.actor.tabs.inventaire"},
      ],
      initial: "main",
    }
  };

  static DEFAULT_OPTIONS = {
    classes: [],
    actions: {
      verouillage: this.verouillage,
      deverouillage: this.deverouillage,
      addRemoveDeCompetence: this.onAddRemoveDeCompetence,
      aptitudeRoll: this.onAptitudeRoll,
      sensRoll: this.onSensRoll,
    },
    position: {
      width: 1030,
      height: 800,
    },
    window: {
      resizable: true,
      controls: [
        {
          action: "verouillage",
          icon: "fa-solid fa-lock",
          label: system.Consts.SYSTEMID + ".pjsheet.action.lock",
          ownership: "OWNER",
          visible: this.#canVerouillage
        },
        {
          action: "deverouillage",
          icon: "fa-solid fa-unlock",
          label: system.Consts.SYSTEMID + ".pjsheet.action.unlock",
          ownership: "OWNER",
          visible: this.#canDeverouillage
        }
      ]
    },
  }

  static #canVerouillage() {
    return this.isEditable && !this.actor.system.isLocked;
  }
  
  static #canDeverouillage() {
    return this.isEditable && this.actor.system.isLocked;
  }

  static async verouillage() {
    await this.actor.update({"system.isLocked":true});
    this._updateFrame({window: {}});
  }
  
  static async deverouillage() {
    await this.actor.update({"system.isLocked":false});
    this._updateFrame({window: {}});
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);

    return data ; 
  }

  
  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)

    context.isVerrou = this.actor.system.isLocked;
    context.lists = {
      races: Races.list(),
    };

    return context
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    
    if(partId == "aptitudes") {
      context.aptitudes = {
        categories: system.Common.Aptitudes.categories,
        aptitudes: system.Common.Aptitudes.list,
      }
    }

    return context;
  }  

  static async _onSkillRoll(event, target){
    event.preventDefault();

    const actor = this.document;
    const competence =  target.dataset.competence;

    const modificateurs = await system.DiceRoller.CompetenceRollDialog.create({ });
    if (modificateurs == null) { return; }

    const myRoll = new system.DiceRoller.CompetenceRoll("XXXXX",{}, {
        modificateurs: modificateurs,
        actor: actor.uuid
    });

    myRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
    });

  }
/*
  static async _onToggle(event, target) {
    this.element.querySelectorAll("[data-toggle_section='" + target.dataset.toggle + "']").forEach(e => e.classList.toggle("visible"));
    //--TODO: ajouter changement icone
  }
*/

  async _onDrop(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);

    switch(data.type)
    {
      case "Item": 
        const item = fromUuidSync(data.uuid);
        
        if(item.type == "objet")
        {
          super._onDrop(event);

        }
    }
  }
  /*
  static async _onAddItem(event, target) {
    event.preventDefault();
    const type = target.dataset.type;
    
    const itemData = {
      name: type,
      type: type,
      system: {}
    };
    
    // Créer l'item sans render automatique
    const created = await this.document.createEmbeddedDocuments("Item", [itemData], { render: true });
    if (created && created[0]) {
      created[0].sheet.render(true, { force: true });
    }
    
    return created;
  }
  
  static async _onEditItem(event, target) {
    event.preventDefault();
    const item = this.document.items.get(target.dataset.itemid);
    if (item) {      
      if (item.sheet.rendered) {
        item.sheet.bringToTop();
      } else {
        item.sheet.render(true, { force: true });
      }
    }
  }
  
  static async _onDeleteItem(event, target) {
    event.preventDefault();
    const item = this.document.items.get(target.dataset.itemid);

    if (item) {
      if(item.system.isDefault == true)
      {
        ui.notifications.error(`Vous ne pouvez pas supprimer ${item.name}, c'est un élément de base.`);
        return;
      }

      let confirmed = false;

      if(event.ctrlKey && event.shiftKey)
      {
        confirmed = true;
      }
      else
      {
        confirmed = await system.Common.Dialog.confirm({
          content: `<p>Êtes-vous sûr de vouloir supprimer ${item.name}?</p>`,
          rejectClose: false,
          modal: true
        });
      }

      if (confirmed) {

        await item.delete({ render: true });
        ui.notifications.info(`${item.name} supprimé(e)`);
      }
    }
  }  
*/
  /*
  static async _onEquipeArmure(event, target) {
    this.actor.items.get(target.dataset.itemid).update({"system.isEquipe": true});
  } 

  static async _onDesequipeArmure(event, target) {
    this.actor.items.get(target.dataset.itemid).update({"system.isEquipe": false});
  } 
*/
  static async onAddRemoveDeCompetence(event, target)
  {
    
    const oldVal = this.actor.system.competences[target.dataset.competence].value;
    
    system.Common.ValeurDe.getNext(5)
    
    const newVal = (target.dataset.sens == "+" ? system.Common.ValeurDe.getNext(oldVal) : system.Common.ValeurDe.getPrev(oldVal));
    
    let change = {};
    change["system.competences." + target.dataset.competence + ".value"] = newVal;

    this.actor.update(change);
  }

  static async onAptitudeRoll(event, target)
  {
    const aptitude = target.dataset.aptitude;
    console.log(aptitude)
    const competences = system.Common.Aptitudes.getApt(aptitude).competences;
    
    const competenceValue = Math.max(...competences.map(c => {
      console.log(this.actor.system.competences, c)
      return this.actor.system.competences[c].value;
    }))

    const aptitudeValue = this.actor.system.aptitudes[aptitude].value;

    AptitudeRoller.execute({
      title: game.i18n.format("glyphes.roll.title.aptitude" , {aptitude: game.i18n.format("glyphes.aptitudes." + aptitude + ".name")}),
      document: this.document,
      aptitude: aptitude,
      aptitudeValue: aptitudeValue,
      competences: competences,
      competenceValue :competenceValue,
    });

  }

  static async onSensRoll(event, target)
  {
    const sens = target.dataset.sens;
    console.log(sens)
    
    const competenceValue = this.actor.system.sens[sens];

    const aptitudeValue = 1 + (foundry.utils.getProperty(Races.get(this.actor.system.race), "modificateurs.sens." + sens + ".nb") || 0);

    AptitudeRoller.execute({
      title: game.i18n.format("glyphes.roll.title.sens" , {sens: game.i18n.format("glyphes.sens." + sens)}),
      document: this.document,
      aptitude: sens,
      aptitudeValue: aptitudeValue,
      competences: "",
      competenceValue :competenceValue,
    });

  }
}