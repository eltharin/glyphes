import * as system from "../../_helpers.mjs";


export class BaseActorDataModel extends system.Models.SystemDataModel {
    static defineSchema() {
    // All Actors have resources.
        return { 
            isLocked: new foundry.data.fields.BooleanField({initial: false}),
            notes: new foundry.data.fields.StringField({}),

            origine: new foundry.data.fields.StringField({}),
            race: new foundry.data.fields.StringField({}),

            points: new foundry.data.fields.SchemaField({
                corps: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0}),
                    max: new foundry.data.fields.NumberField({initial: 0}),
                    bonus: new foundry.data.fields.NumberField({initial: 0}),
                }),
                ame: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0}),
                    max: new foundry.data.fields.NumberField({initial: 0}),
                    bonus: new foundry.data.fields.NumberField({initial: 0}),
                }),
                heroisme: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0}),
                    max: new foundry.data.fields.NumberField({initial: 0}),
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
        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,
        "verifAptitudes",
    ];

    prepareDerivedData() {

        this._prepareDerivedData();

        this.sens = {
            vue: Math.min(this.competences.esprit.value, this.competences.constitution.value),
            ouie: Math.min(this.competences.esprit.value, this.competences.constitution.value),
            flux: this.competences.esprit.value -1 ,
            instinct: Math.min(this.competences.esprit.value, this.competences.foi.value),
        }

        Object.entries(system.Common.Aptitudes.list).forEach(([key, val]) => {
            console.log(key,val, this.aptitudes[key])
            if(!this.aptitudes[key]) {this.aptitudes[key] = {}};
            if(!this.aptitudes[key].value)  {this.aptitudes[key].value = 1;}
            if(!this.aptitudes[key].bonus)  {this.aptitudes[key].bonus = 0;}
        });
        console.log(foundry.utils.deepClone(this.aptitudes))
    }

    _prepareDerivedData() {

    }

    verifAptitudes(changes, clone){
        console.log(changes)
        /*if(foundry.utils.getProperty(clone, "oubli.value") > this._getNbCasesOubliTotal(clone)) {
            foundry.utils.setProperty(changes, "system.oubli.value", this._getNbCasesOubliTotal(clone));
        }*/
    }
}