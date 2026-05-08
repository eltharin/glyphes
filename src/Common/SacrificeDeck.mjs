import { SystemConsts } from "../SystemConsts.mjs";



export class SacrificeDeck {
    static settingsSacrificeDeckId = "deckSacrifice";
    
    static types = 4;
    
    static facemort = {jeton: 1, auto:false, face: "1-mort.png"};

    static faces = {
        destructionMembreInferieur: {jeton: 2, nb:"auto", face: "2-destruction-membre-inferieur.png"},
        destructionMembreSuperieur: {jeton: 3, nb:"auto", face: "3-destruction-membre-superieur.png"},
        perteTemporaireMembreSuperieur: {jeton: 4, nb:"auto", face: "4-perte-temporaire-membre-superieur.png"},
        perteAptitude: {jeton: 5, nb:"auto", face: "5-perte-aptitude.png"},
        diminutionPermanenteSens: {jeton: 6, nb:"auto", face: "6-diminution-permanente-sens.png"},
        perteTemporaireMembreInferieur: {jeton: 7, nb:"auto", face: "7-perte-temporaire-membre-inferieur.png"},
        phobie: {jeton: 8, nb:"auto", face: "8-phobie.png"},
        destructionEquipement: {jeton: 9, nb:"auto", face: "9-destruction-equipement.png"},
        blessureVisage: {jeton: 10, nb:"auto", face: "10-blessure-visage.png"},
        perteTemporaireSens: {jeton: 11, nb:"auto", face: "11-perte-temporaire-sens.png"},
        furie: {jeton: 12, nb:1, face: "12-furie.png"}
    }


    static getDeckId() {
        return game.settings.get(SystemConsts.SYSTEMID, this.settingsSacrificeDeckId);
    }

    static getDeck() {
        return game.cards.get(this.getDeckId());
    }

    static async createDeckIfNotExist() {
        let deck = this.getDeck();
        if(!deck) {
            deck = await this.createDeck();
        }

    }

    static async setMort(nbCards) {
        let deck = this.getDeck();
        
        if(!deck) {
            console.error("Aucun deck de sacrifice");
            return;
        }


        await deck.cards.filter(c => (c.value == 1 && c.drawn == false)).forEach(async c => {await c.delete();});

        let mortCards = deck.cards.filter(c => c.value == 1 && c.drawn == true);

        
        if(mortCards.length < nbCards) {
            await this.createMortCards(deck, nbCards - mortCards.length);
        }
        else if(mortCards.length > nbCards) {
            ui.notifications.warn("Il y a déjà " + mortCards.length + " cartes mort dans le deck, impossible d'en supprimer automatiquement. Veuillez les supprimer manuellement dans le deck de sacrifice.");
        }
    }

    static async createDeck(name = "Sacrifices") {
        let deck = await Cards.create({
            name: name,
            type: "deck"
        });
        await game.settings.set(SystemConsts.SYSTEMID, this.settingsSacrificeDeckId, deck.id);

        const cardsToCreate = [];

        Object.entries(this.faces).forEach(([faceKey, face]) => {
            
            for(let i = 1; i <= (face.nb == "auto" ? this.types : face.nb); i++) {
                cardsToCreate.push(this.newCard({
                    suit: "C" + i,
                    value: face.jeton,
                    drawn: false,
                    face: 0,
                    name: game.i18n.localize("glyphes.cards.sacrifice." + faceKey) + " " + "C" + i,
                    faces: [{
                        img: SystemConsts.ASSETS_PATH + "/pics/cards/sacrifices/" + face.face,
                        name: game.i18n.localize("glyphes.cards.sacrifice." + faceKey)
                    }]
                }));
            };
        });
        await deck.createEmbeddedDocuments("Card", cardsToCreate);

        return deck;
    }

    static newCard(options) {
        return {
            type: "base",
            height: 3,
            width: 2,
            ...options
        };
    }

    static async createMortCards(deck, nbCards) {
        const cardsToCreate = [];
        for(let i=0; i<nbCards; i++) {
            cardsToCreate.push(this.newCard({
                suit: "Fatal",
                value: 1,
                drawn: false,
                face: 0,
                name: game.i18n.localize("glyphes.cards.sacrifice.mort"),
                faces: [{
                    img: SystemConsts.ASSETS_PATH + "/pics/cards/sacrifices/" + this.facemort.face,
                    name: game.i18n.localize("glyphes.cards.sacrifice.mort")
                }]
            }));
        }
        await deck.createEmbeddedDocuments("Card", cardsToCreate);
    }
}
