import * as system from "../../_helpers.mjs";

export class ActorPjDataModel extends system.Actor.BaseActorDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,
    ];

    _prepareDerivedData() {
        this.initiative = "-1 + (" + (this.initiativeTakeVigilance ? this.aptitudes.vigilant.value : 1) + "d" + this.sens.instinct.dice + "kh1cs>=4)*2";
    }    

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        this.parent.prototypeToken.updateSource({actorLink: true, "sight.enabled": true});
    }

}