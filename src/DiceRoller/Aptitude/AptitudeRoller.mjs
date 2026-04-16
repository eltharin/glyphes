import * as system from "../../_helpers.mjs";
import { AptitudeRoll } from "./AptitudeRoll.mjs";


export class AptitudeRoller
{
    static async execute(options)
    {
        const data = {
            difficultes: {
                commun    : {value: 4 , isDefault:true},
                heroique  : {value: 6 , isDefault:false},
                grandiose : {value: 8 , isDefault:false},
                legendaire: {value: 10, isDefault:false},
                mythique  : {value: 12, isDefault:false},
            }
        };

        const dialogData = await foundry.applications.api.DialogV2.input({
            content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/dice/aptitude/roll-dialog.hbs", data),
            window: {title: game.i18n.format("glyphes.roll.common.title")},
            ok: {
                label: game.i18n.format("glyphes.roll.common.rolldice"),
                default: true,
                icon: "fa-solid fa-dice",
            }
        });
        if(dialogData == null) {return;}


        let nbDe = options.aptitudeValue + dialogData.nbDeBonus;
        const nbFace = options.competenceValue;

        let modifiers = "";

        if(nbDe <= 0)
        {
            nbDe = 2;
            modifiers = "kl";
        }
        
        const myRoll = new AptitudeRoll(nbDe + "d" + nbFace + "cs>=" + dialogData.typeDifficulte + modifiers,{}, {
            title: options.title,
            typeDifficulte: dialogData.typeDifficulte, 
            rangDifficulte: dialogData.rangDifficulte, 
        });

        myRoll.toMessage({
            speaker: ChatMessage.getSpeaker({ alias: options.document.name + " ( " + game.user.name + " )"}),
        });
    }
}