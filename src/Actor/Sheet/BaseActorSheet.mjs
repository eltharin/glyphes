import * as system  from "../../_helpers.mjs";
import { Aptitudes } from "../../Common/Aptitudes.mjs";
import { Races } from "../../Common/Races.mjs";
import { ValeurDe } from "../../Common/ValeurDe.mjs";
import { AptitudeRoller } from "../../DiceRoller/Aptitude/AptitudeRoller.mjs";
import { Dialog } from "../../Models/Dialog.mjs";
import { BaseSheet } from "../../Models/Sheet/BaseSheet.mjs";


export class BaseActorSheet extends BaseSheet (
  foundry.applications.sheets.ActorSheetV2
) {

  static PARTIALS = {
    sidebar: system.Consts.TEMPLATES_PATH + "/actor/parts/sidebar.hbs",
    topbar: system.Consts.TEMPLATES_PATH + "/actor/parts/topbar.hbs",
    actionHeroique_liste: system.Consts.TEMPLATES_PATH + "/shared/actionHeroique/liste.hbs",
  };

  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/actor/pj/pj-sheet.hbs",
      templates: [
        "sidebar",
        "topbar",
        "actionHeroique_liste",
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
    max: {
      template: system.Consts.TEMPLATES_PATH + "/actor/parts/max.hbs",
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
        {id: "max", label:"glyphes.sheet.actor.tabs.max"},
      ],
      initial: "main",
    }
  };

  static DEFAULT_OPTIONS = {
    classes: [...super.DEFAULT_OPTIONS.classes??[], "glyphes-sheet", "glyphes-actor-sheet"],
    actions: {
      verouillage: this.verouillage,
      deverouillage: this.deverouillage,
      
      toggle: this._onToggle,

      addItem: this._onAddItem,
      editItem: this._onEditItem,
      deleteItem: this._onDeleteItem,

      addRemoveDeCompetence: this.onAddRemoveDeCompetence,
      addRemoveDePts: this.onAddRemovePts,
      aptitudeRoll: this.onAptitudeRoll,
      sensRoll: this.onSensRoll,
      ajoutDon: this.onAjoutDon,
      supprDon: this.onSupprDon,      
      addEffet: this._onAddEffet,
      editEffet: this._onEditEffet,
      deleteEffet: this._onDeleteEffet,
      pioche: this._onPioche,
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

  static async _onToggle(event, target) {
    this.element.querySelectorAll("[data-toggle_section='" + target.dataset.toggle + "']").forEach(e => e.classList.toggle("visible"));
    //--TODO: ajouter changement icone
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);

    return data ; 
  }

  
  async _prepareContext(options) {

    this.document.system.getSacrificesCards();

    const context = await super._prepareContext(options)

    context.isVerrou = this.actor.system.isLocked;
    context.lists = {
      races: Races.list(),
      aptitudes: Aptitudes.list,
    };
    
    context.actionsHeroiques = this.document.effects.filter(e => e.type == "actionHeroique");


    let allItems = foundry.utils.deepClone(this.document.items.documentsByType);

//    context.effets = this.document.effects.filter(e => e.type != "base");

    context.armes = allItems.arme || [];
    delete allItems.arme;
    context.armures = allItems.armure || [];
    delete allItems.armure;
    context.glyphes = allItems.glyphe || [];
    delete allItems.glyphe;
    context.fabrications = allItems.fabrication || [];
    delete allItems.fabrication;
    context.consommables = allItems.consommable || [];
    delete allItems.consommable;
    
    context.items = Object.values(allItems).reduce((a, b ) => [...a, ...b], []);


    context.system.points.corps.nope = context.system.points.corps.max - context.system.points.corps.value - context.system.points.corps.bonus;
    context.system.points.ame.nope = context.system.points.ame.max - context.system.points.ame.value - context.system.points.ame.bonus;
    context.system.points.heroisme.nope = context.system.points.heroisme.max - context.system.points.heroisme.value - context.system.points.heroisme.bonus;
    context.system.points.tempete.nope = context.system.points.tempete.max - context.system.points.tempete.value - context.system.points.tempete.bonus;
    context.system.points.blessure.nope = context.system.points.blessure.max - context.system.points.blessure.value - context.system.points.blessure.bonus;

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

    context.ValeurDe = ValeurDe;
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
        
        if(item.type == "objet" || item.type == "arme" || item.type == "armure" || item.type == "consommable" || item.type == "glyphe" || item.type == "fabrication")
        {
          super._onDrop(event);

        }
        else {
          console.log("Tentative de drop d'un item de type " + item.type + " sur la fiche acteur, ce qui n'est pas supporté.");
        }
    }
  }
  
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
        confirmed = await system.Models.Dialog.confirm({
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
    
    const newVal = (target.dataset.sens == "+" ? system.Common.ValeurDe.getNext(oldVal) : system.Common.ValeurDe.getPrev(oldVal));

    if(!newVal === null) {
      return ;
    }

    let change = {};
    change["system.competences." + target.dataset.competence + ".value"] = newVal;
    
    this.actor.update(change);
  }

  static async onAddRemovePts(event, target)
  {
    
    const oldVal = this.actor.system.points[target.dataset.pointtype].value;
    
    const newVal = (target.dataset.sens == "+" ? 1 : -1) + oldVal;
    
    let change = {};
    change["system.points." + target.dataset.pointtype + ".value"] = newVal;

    this.actor.update(change);
  }

  static async onAptitudeRoll(event, target)
  {
    const aptitude = target.dataset.aptitude;
    const competences = system.Common.Aptitudes.getApt(aptitude).competences;
    

    const competenceValue = ValeurDe.getVal(Math.max(...competences.map(c => {
      return this.actor.system.competences[c].value;
    })));

    
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

  static async onAjoutDon(event, target)
  {
    const data = await foundry.applications.api.DialogV2.input({
      title: game.i18n.format("glyphes.sheet.actor.don.select"),
      content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/actor/dialog/ajoutDon.hbs", {
        dons : system.Common.Dons.list().filter(d => !this.actor.system.dons.includes(d.id)),
      }),
      modal: true,
    });

    if(data)    {
      let dons = this.actor.system.dons;
      dons.push(data.don);
      await this.actor.update({"system.dons": dons});
    }
  }

  static async onSupprDon(event, target)
  {
    if (await foundry.applications.api.DialogV2.confirm({
      content: game.i18n.format("glyphes.common.dialog.askDelete", {name: game.i18n.format("glyphes.dons." + target.dataset.don + ".name")}),
      rejectClose: false,
      modal: true
    })) {
      const donId = target.dataset.don;
      let dons = this.actor.system.dons;
      dons = dons.filter(d => d != donId);
      await this.actor.update({"system.dons": dons});
    }
  }


  static async _onAddEffet(event, target) {
    event.preventDefault();
    

        const data = await Dialog.input({
      title: game.i18n.format("glyphes.sheet.actor.dialog.ajoutActHer.title"),
      content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/effet/actionHeroique/form.hbs", {
        isCreation: true,
        actionsHeroiques : system.Common.ActionsHeroiques.list().filter(d => d.destination.includes("actor")),
      }),
      render: event => {
        event.target.element.querySelector("form select.actionHeroique").addEventListener("change", ev2 => {
          event.target.element.querySelector("input[name='name']").value = ev2.target.selectedOptions[0].dataset.name || "";
          event.target.element.querySelector("textarea[name='system.effet']").value = ev2.target.selectedOptions[0].dataset.effet || "";
          event.target.element.querySelector("input[name='system.cout']").value = ev2.target.selectedOptions[0].dataset.cout || "";
        }, {passive: true});
      },
      modal: true,
    });

    if(data) {
      const effetData = {
        name: data.name,
        type: "actionHeroique",
        system: {
          effet: data["system.effet"],
          cout: data["system.cout"],
        }
      };
    
      // Créer l'item sans render automatique
      const created = await this.document.createEmbeddedDocuments("ActiveEffect", [effetData], { render: true });
      if (created && created[0]) {
        //created[0].sheet.render(true, { force: true });
      }
    }
  }
  
  static async _onEditEffet(event, target) {
    event.preventDefault();
    const effet = this.document.effects.get(target.dataset.effet);
    if (effet) {      
      if (effet.sheet.rendered) {
        effet.sheet.bringToTop();
      } else {
        effet.sheet.render(true, { force: true });
      }
    }
  }
  
  static async _onDeleteEffet(event, target) {
    event.preventDefault();
    const effet = this.document.effects.get(target.dataset.effet);

    if (effet) {
      
      let confirmed = false;

      if(event.ctrlKey && event.shiftKey)
      {
        confirmed = true;
      }
      else
      {
        confirmed = await foundry.applications.api.DialogV2.confirm({
          content: `<p>Êtes-vous sûr de vouloir supprimer ${effet.name}?</p>`,
          rejectClose: false,
          modal: true
        });
      }

      if (confirmed) {

        await effet.delete({ render: true });
        ui.notifications.info(`${effet.name} supprimé(e)`);
      }
    }
  }  

  static async _onPioche(event, target) {
      
    let handId = this.actor.system.sacrificeDeckId;
    let hand = game.cards.get(handId);

    if(!hand) {
      hand = await Cards.create({
        name: `Sacrifice Hand of ${this.actor.name}}`,
        type: "hand"
      });
      handId = hand.id;
      await this.actor.update({"system.sacrificeDeckId": handId, render: false});
    }


    const deck = game.cards.get(game.settings.get("glyphes", "deckSacrifice") ?? "");
    if(!deck) {
      ui.notifications.error("PAs de deck créé, veuillez le créer avant.");
    }

    const card = await hand.draw(deck, 1 , {how: CONST.CARD_DRAW_MODES.RANDOM, chatNotification: false});
    
    

    ChatMessage.create({
      user: game.user.id,
      content: `
        <div>
          <h2>Le joueur pioche une carte</h2>
          <h3>${card[0].faces[0].name}</h3>
          <img src="${card[0].faces[0].img}" style="width: 150px; border: 2px solid #444;">
        </div>
      `
    });

    this.render(true, {force: true});
  }
}