import * as system from "../../_helpers.mjs";


export class ActorPnjDataModel extends system.Actor.BaseActorDataModel {
    static defineSchema() {
    // All Actors have resources.
        return {
            ...super.defineSchema(),
        };
    }

}