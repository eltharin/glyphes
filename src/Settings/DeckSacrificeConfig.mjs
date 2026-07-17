import { SacrificeDeck } from "../Common/SacrificeDeck.mjs";
import { SystemConsts } from "../SystemConsts.mjs";



export class DeckSacrificeConfig extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  static PARTS = {
    form: { 
      template: SystemConsts.TEMPLATES_PATH + "/settings/deckSacrifice.hbs"
    },
  };

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
        //handler: this.#onSubmitForm,
        closeOnSubmit: false,
        submitOnChange: true
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
    actions: {
      creerDeck: this._onCreerDeck,
      supprimerDeck: this._onSupprimerDeck,
    }
  }

  async _prepareContext() {
    return {
      deck: game.settings.get("glyphes", "deckSacrifice") ?? "",
      nbJoueurs: game.actors.filter(a => a.type == "pj").length
    };
  }


  static async _onCreerDeck(event, target) {
    await SacrificeDeck.createDeckIfNotExist();
    await SacrificeDeck.setMort(Number(target.closest("form").querySelector('input[name="nbMort"]').value));

  }

  static async _onSupprimerDeck(event, target) {
    const deck = SacrificeDeck.getDeck();

    if (deck ){
      await deck.delete();
    }
    
    await game.settings.set("glyphes", "deckSacrifice", "")
    this.render(true, {force: true});
  }

  static async _onSupprimerLiaison(event, target) {
    await game.settings.set("glyphes", "deckSacrifice", "")
    this.render(true, {force: true});
  }
}