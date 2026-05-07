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

            argent: new foundry.data.fields.NumberField({initial: 0}),
            
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
                blessure: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0, min:0}),
                    max: new foundry.data.fields.NumberField({initial: 3, min:0}),
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
            fabrication: new foundry.data.fields.SchemaField({
                aptitude: new foundry.data.fields.StringField({initial: ""}),
                nbIngredients: new foundry.data.fields.NumberField({initial: 0, min: 0})
            }),
        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,
        "verifAptitudes",
        "verifPtsCorps",
        "verifPtsAme",
        "verifPtsHeroisme",
        "verifPtsTempete",
        "verifPtsBlessure",
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
        if(foundry.utils.hasProperty(changes, "competences")) {
            foundry.utils.getProperty(changes, "competences").forEach((comp, key) => {
                if(comp.value < 0 || comp.value > ValeurDe.ordre.length) {
                    console.error(`Compétence ${key} a une valeur invalide (${comp.value}). Réinitialisation à 0.`);
                    foundry.utils.deleteProperty(changes, `competences.${key}.value`);
                }
            });
        }
    }

    verifPtsCorps(changes, clone){
        if(foundry.utils.getProperty(clone, "points.corps.value") + foundry.utils.getProperty(clone, "points.corps.bonus") > foundry.utils.getProperty(clone, "points.corps.max")) {
            if(foundry.utils.hasProperty(changes, "system.points.corps.value")) {
                foundry.utils.setProperty(changes, "system.points.corps.value", foundry.utils.getProperty(clone, "points.corps.max") - foundry.utils.getProperty(clone, "points.corps.bonus"));
            }
            else if(foundry.utils.hasProperty(changes, "system.points.corps.bonus")) {
                foundry.utils.setProperty(changes, "system.points.corps.bonus", foundry.utils.getProperty(clone, "points.corps.max") - foundry.utils.getProperty(clone, "points.corps.value"));
            }
        }
    }

    verifPtsAme(changes, clone){
        if(foundry.utils.getProperty(clone, "points.ame.value") + foundry.utils.getProperty(clone, "points.ame.bonus") > foundry.utils.getProperty(clone, "points.ame.max")) {
            if(foundry.utils.hasProperty(changes, "system.points.ame.value")) {
                foundry.utils.setProperty(changes, "system.points.ame.value", foundry.utils.getProperty(clone, "points.ame.max") - foundry.utils.getProperty(clone, "points.ame.bonus"));
            }
            else if(foundry.utils.hasProperty(changes, "system.points.ame.bonus")) {
                foundry.utils.setProperty(changes, "system.points.ame.bonus", foundry.utils.getProperty(clone, "points.ame.max") - foundry.utils.getProperty(clone, "points.ame.value"));
            }
        }
    }

    verifPtsHeroisme(changes, clone){
        if(foundry.utils.getProperty(clone, "points.heroisme.value") + foundry.utils.getProperty(clone, "points.heroisme.bonus") > foundry.utils.getProperty(clone, "points.heroisme.max")) {
            if(foundry.utils.hasProperty(changes, "system.points.heroisme.value")) {
                foundry.utils.setProperty(changes, "system.points.heroisme.value", foundry.utils.getProperty(clone, "points.heroisme.max") - foundry.utils.getProperty(clone, "points.heroisme.bonus"));
            }
            else if(foundry.utils.hasProperty(changes, "system.points.heroisme.bonus")) {
                foundry.utils.setProperty(changes, "system.points.heroisme.bonus", foundry.utils.getProperty(clone, "points.heroisme.max") - foundry.utils.getProperty(clone, "points.heroisme.value"));
            }
        }
    }

    verifPtsTempete(changes, clone){
        if(foundry.utils.getProperty(clone, "points.tempete.value") + foundry.utils.getProperty(clone, "points.tempete.bonus") > foundry.utils.getProperty(clone, "points.tempete.max")) {
            if(foundry.utils.hasProperty(changes, "system.points.tempete.value")) {
                foundry.utils.setProperty(changes, "system.points.tempete.value", foundry.utils.getProperty(clone, "points.tempete.max") - foundry.utils.getProperty(clone, "points.tempete.bonus"));
            }
            else if(foundry.utils.hasProperty(changes, "system.points.tempete.bonus")) {
                foundry.utils.setProperty(changes, "system.points.tempete.bonus", foundry.utils.getProperty(clone, "points.tempete.max") - foundry.utils.getProperty(clone, "points.tempete.value"));
            }
        }
    }

    verifPtsBlessure(changes, clone){
        if(foundry.utils.getProperty(clone, "points.blessure.value") + foundry.utils.getProperty(clone, "points.blessure.bonus") > foundry.utils.getProperty(clone, "points.blessure.max")) {
            if(foundry.utils.hasProperty(changes, "system.points.blessure.value")) {
                foundry.utils.setProperty(changes, "system.points.blessure.value", foundry.utils.getProperty(clone, "points.blessure.max") - foundry.utils.getProperty(clone, "points.blessure.bonus"));
            }
            else if(foundry.utils.hasProperty(changes, "system.points.blessure.bonus")) {
                foundry.utils.setProperty(changes, "system.points.blessure.bonus", foundry.utils.getProperty(clone, "points.blessure.max") - foundry.utils.getProperty(clone, "points.blessure.value"));
            }
        }
    }
}