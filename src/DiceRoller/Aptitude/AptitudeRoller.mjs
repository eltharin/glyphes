import * as system from "../../_helpers.mjs";
import { AptitudeRoll } from "./AptitudeRoll.mjs";
import { AptitudeAskMessage } from "./AptitudeAskMessage.mjs";
import { ValeurDe } from "../../Common/ValeurDe.mjs";
import { PjSheet } from "../../Actor/Sheet/PjSheet.mjs";
import { Races } from "../../Common/Races.mjs";

export class AptitudeRoller
{
    static async execute(options)
    {
        
        let CompSens = null;
        let msgTitle = null;
        let aptitudeValue = null;

        options.document.sheet.render(false);
        
        if(options.type == "aptitude") {
            const aptitude = system.Common.Aptitudes.getApt(options.aptitude);
        
            CompSens = [
            ...(aptitude.competences ?? []).map(c => ({titre: game.i18n.format("glyphes.competences." + c + ".long"), val : options.document.system.competences[c].value})),
            ...(aptitude.sens ?? []).map(s => ({titre: game.i18n.format("glyphes.sens." + s), val : options.document.system.sens[s].value})),
            ];
            
            if((aptitude.mustChoose || false) == false) {
                CompSens = CompSens.reduce((max, obj) =>
                    obj.val > max.val ? obj : max
                );
            }
            
            aptitudeValue = options.document.system.aptitudes[options.aptitude].value;
            msgTitle = game.i18n.format("glyphes.roll.title.aptitude" , {aptitude: game.i18n.format("glyphes.aptitudes." + options.aptitude + ".name")});

        } else if(options.type == "sens") {
            msgTitle = game.i18n.format("glyphes.roll.title.sens" , {sens: game.i18n.format("glyphes.sens." + options.sens)}),
            CompSens = {titre: game.i18n.format("glyphes.sens." + options.sens), val: options.document.system.sens[options.sens].value};
            aptitudeValue = 1 + (foundry.utils.getProperty(Races.get(options.document.system.race), "modificateurs.sens." + options.sens + ".nb") || 0);
        } else {
            console.error("cas non géré");
            return;
        }


        const data = {
            difficultes: system.Common.Difficultes.difficultes,
            isMJ: game.user.isGM && options.document._sheet.constructor === PjSheet,
            isReposneMJ: (options.typeDifficulte || null) !== null && (options.rangDifficulte || null) !== null,
            mustChoose: CompSens.constructor == Array,
            competences: CompSens,
            ValeurDe: ValeurDe,
            typeDifficulte: options.typeDifficulte || null,
            rangDifficulte: options.rangDifficulte || null,
        };

        const dialogData = await system.Base.Dialog.input({
            content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/dice/aptitude/roll-dialog.hbs", data),
            window: {title: game.i18n.format("glyphes.roll.common.title")},
            ok: {
                label: game.i18n.format("glyphes.roll.common.rolldice"),
                default: true,
                icon: "fa-solid fa-dice",
            }
        });

        if(dialogData == null) {return;}

        if(data.isMJ && dialogData.lancerJoueur) {

            const myRoll = AptitudeAskMessage.create( {
                title: msgTitle,
                typeDifficulte: dialogData.typeDifficulte, 
                rangDifficulte: dialogData.rangDifficulte, 
                actor: options.document.uuid,
                aptitude: options.aptitude,
            },{
                speaker: ChatMessage.getSpeaker({ alias: options.document.name + " ( " + game.user.name + " )"}),
            });


            return;
        } else {

            if(dialogData.idcompsens !== undefined) {
                CompSens = CompSens[dialogData.idcompsens];
            }

            let nbDe = aptitudeValue + dialogData.nbDeBonus;
            

            const nbFace = ValeurDe.getVal(CompSens.val);

            let modifiers = "";

            if(nbDe <= 0)
            {
                nbDe = 2;
                modifiers = "kl";
            }
            


            const myRoll = new AptitudeRoll(nbDe + "d" + nbFace + "cs>=" + dialogData.typeDifficulte + modifiers,{}, {
                title: msgTitle,
                typeDifficulte: dialogData.typeDifficulte, 
                rangDifficulte: dialogData.rangDifficulte, 
                document: options.document.uuid,
            });

            myRoll.toMessage({
                speaker: ChatMessage.getSpeaker({ alias: options.document.name + " ( " + game.user.name + " )"}),
            });
        }
    }
}