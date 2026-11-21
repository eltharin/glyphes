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

        options.document.sheet.render(false);
        
        if(options.type == "aptitude") {
            const aptitude = system.Common.Aptitudes.getApt(options.aptitude);
        
            CompSens = [
            ...(options.document.system.aptitudes[options.aptitude].rollcompetences ?? []).map(c => ({
                titre: game.i18n.format("glyphes.competences." + c + ".long"), 
                faces : options.document.system.competences[c].value,
                nb: options.document.system.aptitudes[options.aptitude].value - options.document.system.competences[c].malus
            })),
            ...(aptitude.sens ?? []).map(s => ({
                titre: game.i18n.format("glyphes.sens." + s), 
                faces : options.document.system.sens[s].value,
                nb: options.document.system.aptitudes[options.aptitude].value
            })),
            ];
            
            CompSens.sort((b, a) => a.faces * 1000 + a.nb - b.faces * 1000 - b.nb );
            
            msgTitle = game.i18n.format("glyphes.roll.title.aptitude" , {aptitude: game.i18n.format("glyphes.aptitudes." + options.aptitude + ".name")});

        } else if(options.type == "sens") {
            msgTitle = game.i18n.format("glyphes.roll.title.sens" , {sens: game.i18n.format("glyphes.sens." + options.sens)}),
            CompSens = [{
                titre: game.i18n.format("glyphes.sens." + options.sens), 
                faces: options.document.system.sens[options.sens].value,
                nb: 1 + (foundry.utils.getProperty(Races.get(options.document.system.race), "modificateurs.sens." + options.sens + ".nb") || 0)
            }];
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
            actor : fromUuidSync(options.document.uuid),
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

            let nbDe = CompSens.nb + dialogData.nbDeBonus;
            
            if(dialogData.addPtsCorps > 0 || dialogData.addPtsAme > 0) {

                if(data.actor.system.points.corps.value + data.actor.system.points.corps.bonus - dialogData.addPtsCorps < 0) {
                    ui.notifications.error(game.i18n.format("glyphes.roll.aptitude.error.ptsCorps"));
                    return;
                }
                
                if(data.actor.system.points.ame.value + data.actor.system.points.ame.bonus - dialogData.addPtsAme < 0) {
                    ui.notifications.error(game.i18n.format("glyphes.roll.aptitude.error.ptsAme"));
                    return;
                }
                
                if(CompSens.faces + dialogData.addPtsCorps + dialogData.addPtsAme >= ValeurDe.dices.length) {
                    ui.notifications.error(game.i18n.format("glyphes.roll.aptitude.error.toomuch"));
                    return;
                }

                data.actor.update({
                    "system.points.corps.bonus" : Math.max(0, data.actor.system.points.corps.bonus - dialogData.addPtsCorps),
                    "system.points.corps.value" : data.actor.system.points.corps.value - dialogData.addPtsCorps + data.actor.system.points.corps.bonus - Math.max(0, data.actor.system.points.corps.bonus - dialogData.addPtsCorps),
                    "system.points.ame.bonus" : Math.max(0, data.actor.system.points.ame.bonus - dialogData.addPtsAme),
                    "system.points.ame.value" : data.actor.system.points.ame.value - dialogData.addPtsAme + data.actor.system.points.ame.bonus - Math.max(0, data.actor.system.points.ame.bonus - dialogData.addPtsAme),
                });

                CompSens.faces += dialogData.addPtsCorps + dialogData.addPtsAme;
            }

            const nbFace = ValeurDe.getVal(CompSens.faces);

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