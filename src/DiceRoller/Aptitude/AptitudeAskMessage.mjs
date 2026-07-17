
import * as system  from "../../_helpers.mjs";
import { AptitudeRoller } from "./AptitudeRoller.mjs";

export class AptitudeAskMessage extends system.DiceRoller.BaseRoll{
    
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/aptitude/askMessage.hbs";

    constructor(formula="", data={}, options={}) {
        formula = "0";   
        super(formula, data, options);
    }

    static create(options, chatMessageOptions={}) {
        const myRoll = new AptitudeAskMessage("0", {}, options);
        myRoll.toMessage(chatMessageOptions);
        return myRoll;
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        

        return ret;
    }

    
    static async _onReponseDemandeMJ(event, message, target) {
        AptitudeRoller.execute({
            document: fromUuidSync(message.rolls[0].options.actor),
            type: "aptitude",
            aptitude: message.rolls[0].options.aptitude,
            typeDifficulte: message.rolls[0].options.typeDifficulte,
            rangDifficulte: message.rolls[0].options.rangDifficulte,
        });

    }
}