import * as system from "../../_helpers.mjs";
import { ValeurDe } from "../../Common/ValeurDe.mjs";


export class BaseActorDataModel extends system.Models.SystemDataModel {
    static defineSchema() {
    // All Actors have resources.
        return { 
            isLocked: new foundry.data.fields.BooleanField({initial: false}),
            notes: new foundry.data.fields.StringField({}),

            origine: new foundry.data.fields.StringField({}),
            race: new foundry.data.fields.StringField({}),

            richesse: new foundry.data.fields.NumberField({initial: 0}),
            blessures: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0, min:0}),
                    max: new foundry.data.fields.NumberField({initial: 3, min:0}),
                    bonus: new foundry.data.fields.NumberField({initial: 0}),
            }),
            resilience: new foundry.data.fields.NumberField({initial: 0, min:0}),
            esquive: new foundry.data.fields.NumberField({initial: 0, min:0}),

            points: new foundry.data.fields.SchemaField({
                corps: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0, min:0}),
                    max: new foundry.data.fields.NumberField({initial: 5, min:0}),
                    bonus: new foundry.data.fields.NumberField({initial: 0}),
                }),
                ame: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0, min:0}),
                    max: new foundry.data.fields.NumberField({initial: 5, min:0}),
                    bonus: new foundry.data.fields.NumberField({initial: 0}),
                }),
                heroisme: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0, min:0}),
                    max: new foundry.data.fields.NumberField({initial: 5, min:0}),
                    bonus: new foundry.data.fields.NumberField({initial: 0}),
                }),
                tempete: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0, min:0}),
                    max: new foundry.data.fields.NumberField({initial: 12, min:0}),
                    bonus: new foundry.data.fields.NumberField({initial: 0}),
                }),
            }),
            
            competences: new foundry.data.fields.SchemaField({
                puissance: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                souplesse: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                constitution: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                foi: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                esprit: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                social: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                })
            }),   
            aptitudes: new foundry.data.fields.TypedObjectField(
                new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({ initial: 1 }),
                    bonus: new foundry.data.fields.NumberField({ initial: 0 })
                })
                ,
                {
                    initial: {},
                    dictionary: false,
                    validateKey: key => {return key in system.Common.Aptitudes.list;},
                },
                
            ),
            dons: new foundry.data.fields.ArrayField(
                new foundry.data.fields.StringField({}),      
            ),
            sacrificeDeckId: new foundry.data.fields.StringField({initial: ""}),
        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,
        "verifAptitudes",
    ];

    prepareDerivedData() {

        this._prepareDerivedData();

        this.sens = {
            vue: ValeurDe.getVal(Math.min(this.competences.esprit.value, this.competences.constitution.value)),
            ouie: ValeurDe.getVal(Math.min(this.competences.esprit.value, this.competences.constitution.value)),
            flux: ValeurDe.getVal(Math.max(0, this.competences.esprit.value -1 )),
            instinct: ValeurDe.getVal(Math.min(this.competences.esprit.value, this.competences.foi.value)),
        }

        this.donsObj = this.dons.map(donId => { return (system.Common.Dons.get(donId) || null ); });

        Object.entries(system.Common.Aptitudes.list).forEach(([key, val]) => {
            if(!this.aptitudes[key]) {this.aptitudes[key] = {}};
            if(!this.aptitudes[key].value)  {this.aptitudes[key].value = 1;}
            if(!this.aptitudes[key].bonus)  {this.aptitudes[key].bonus = 0;}
        });
        
        
        Object.keys(this.competences).forEach(key => {
            if(this.competences[key].value < 0 || this.competences[key].value > ValeurDe.ordre.length) {
                console.error(`Compétence ${key} a une valeur invalide (${this.competences[key].value}). Réinitialisation à 0.`);
                this.competences[key].value = 0;
            }
            this.competences[key].dice = ValeurDe.getVal(this.competences[key].value);
        });

        this.getSacrificesCards();
        //this.competences = this.competences.map(comp => (comp.value < 0 || comp.value > ValeurDe.ordre.length) ? {...comp, value: 0} : comp);
    }

    getSacrificesCards() {
        this.sacrificesCards = this.sacrificeDeckId ? game.cards.get(this.sacrificeDeckId)?.availableCards : [];
    }

    _prepareDerivedData() {

    }

    verifAptitudes(changes, clone){
        console.log(changes);

        if(foundry.utils.hasProperty(changes, "competences")) {
            foundry.utils.getProperty(changes, "competences").forEach((comp, key) => {
                if(comp.value < 0 || comp.value > ValeurDe.ordre.length) {
                    console.error(`Compétence ${key} a une valeur invalide (${comp.value}). Réinitialisation à 0.`);
                    foundry.utils.deleteProperty(changes, `competences.${key}.value`);
                }
            });
        }
    }
}