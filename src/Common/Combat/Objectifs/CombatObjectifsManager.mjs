import * as system  from "../../../_helpers.mjs";
import { CombatObjectif } from "./CombatObjectif.mjs";

export class CombatObjectifsManager {

    static FLAG_OBJECTIFS = "flags." + system.Consts.SYSTEMID + ".objectifs";


    static init() {

        Hooks.on("preCreateCombat", (combat, change) => {
            if (!foundry.utils.getProperty(combat,  this.FLAG_OBJECTIFS)) {
                combat.updateSource({[this.FLAG_OBJECTIFS]: {}});
            }            
        });


        Hooks.on("renderCombatTracker", (app, html, data) => {

            const header = html.querySelector(".combat-tracker-header");

            let objectifsContainer = header.querySelector(".combat-tracker-header-objectifs");

            if(data.combat == null) {
                objectifsContainer?.remove();
                return;
            }

            if (!objectifsContainer) {
                objectifsContainer = this.createHeader(header, data);
            }

            const objectifsList = objectifsContainer.querySelector(".combat-tracker-header-objectifs-list");

            objectifsList.textContent = "";
            
            for(const [uid, obj] of Object.entries(foundry.utils.getProperty(data.combat,  this.FLAG_OBJECTIFS))) {
                this.writeObjectif(data, objectifsList, uid, obj);
            }
        });  
    } 

    static createHeader(header, data) {
        const objectifsContainer = document.createElement("div");
        objectifsContainer.classList.add("combat-tracker-header-objectifs");
        header.appendChild(objectifsContainer);

        const objectifsHeader = document.createElement("header");
        objectifsContainer.appendChild(objectifsHeader);

        const objectifsHeaderTitle = document.createElement("span");

        objectifsHeaderTitle.textContent = game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.titre");
        objectifsHeader.appendChild(objectifsHeaderTitle);

        if(game.user.isGM) {
            const objectifsHeaderPlus = document.createElement("div");
            objectifsHeaderPlus.textContent = "+";
            objectifsHeaderPlus.title =  game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.titleAddBtn");

            objectifsHeader.appendChild(objectifsHeaderPlus);

            objectifsHeaderPlus.onclick = async (e) => {
                if(!game.user.isGM) return;
                e.stopPropagation();

                const dialog = await system.Base.Dialog.input({
                    content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/combat/popup-ajout-objectif.hbs", {}),
                    window: {title: game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.dialog.titleAjout")},
                    ok: { label: game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.dialog.btnAjout")},
                    submit: result => {

                        let update = {};
                        const uid = foundry.utils.randomID();
                        update[this.FLAG_OBJECTIFS] = {
                            ...foundry.utils.getProperty(data.combat,  this.FLAG_OBJECTIFS),
                            [uid]: CombatObjectif.create(result.text, result.mask)
                        };

                        data.combat.update(update);
                    }
                });
            };
        }

        const objectifsData = document.createElement("div");
        objectifsData.classList.add("combat-tracker-header-objectifs-list");
        objectifsContainer.appendChild(objectifsData);

        return objectifsContainer;
    }

    static writeObjectif(data, objectifsList, uid, obj) {
        const objectifItem = document.createElement("div");
        objectifItem.classList.add("combat-tracker-header-objectifs-item");
        objectifItem.dataset["uid"] = uid;
        objectifsList.appendChild(objectifItem);

        const objectifItemEtat = document.createElement("span");
        objectifItemEtat.innerHTML = "<img style='height:14px;padding-top:2px;' src='" + system.Consts.ASSETS_PATH + "/pics/status/" + (obj.status == 0 ? "encours" : (obj.status == 1 ? "reussi" : "echec")) + ".svg'>";
        objectifItem.appendChild(objectifItemEtat);
        
        const objectifItemText = document.createElement("span");
        objectifItemText.textContent = ((!game.user.isGM && obj.mask == 1) ? "????????" : obj.text);
        objectifItem.appendChild(objectifItemText);

        if(game.user.isGM) {
            
            objectifItemText.title = game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.edit");
            objectifItemText.classList.add("clickable");
            objectifItemText.onclick = async (e) => {
                if(!game.user.isGM) return;
                e.stopPropagation();

                const dialog = await system.Base.Dialog.input({
                    content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/combat/popup-ajout-objectif.hbs", {
                        objectif: obj
                    }),
                    window: {title: game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.dialog.titleModif")},
                    ok: {
                        label: game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.dialog.btnModif"),
                    },
                    submit: async (result) => {
                        
                        const objectifs = foundry.utils.getProperty(data.combat, this.FLAG_OBJECTIFS);

                        let objectif = objectifs[uid];

                        if(objectif.status != result.status && result.status != 0) {
                            await system.Base.Dialog.input({
                                content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/combat/popup-resolve-objectif.hbs", {
                                    combatants: data.combat.combatants
                                }),
                                buttons: [
                                    {
                                        label: "Annuler",
                                        callback: () => null,
                                    },
                                ],
                                window: {title: game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.dialog.titleModif")},
                                submit: result2 => {
                                    console.log(result2)
                                    if(result2) {
                                        for(const act of result2.actors.filter(e => e)){ 
                                            const actor = fromUuidSync(act);
                                            if(result.status == -1) {
                                                actor.update({"system.points.heroisme.value": 0});
                                            } else if(result.status == 1) {
                                                actor.update({"system.points.heroisme.value": Math.min(actor.system.points.heroisme.max, actor.system.points.heroisme.value + 5)});
                                            }
                                        }
                                    }
                                }
                            });
                        }

                        data.combat.update({[this.FLAG_OBJECTIFS] : {
                            ...objectifs,
                            [uid] : {...objectif, ...result},
                        }});
                        /*
                        data.combat.update({[this.FLAG_OBJECTIFS] : Object.entries(foundry.utils.getProperty(data.combat,  this.FLAG_OBJECTIFS)).reduce((acc, [key, val]) => {
                            if(key != uid) {
                                acc[key] = val;
                            } else {
                                acc[key] = {...val, ...result};
                            }
                            return acc;
                        }, {})});
                        */
                    }
                });
            };

            const objectifItemSuppr = document.createElement("span");
            objectifItemSuppr.textContent = "X";
            objectifItemSuppr.classList.add("clickable");
            objectifItem.appendChild(objectifItemSuppr);

            objectifItemSuppr.onclick = async (e) => {
                if(!game.user.isGM) return;
                e.stopPropagation();

                const dialog = await system.Base.Dialog.confirm({
                    content: game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.delete"),
                    submit: result => {
                        if (result) {
                            data.combat.update({[this.FLAG_OBJECTIFS] : Object.entries(foundry.utils.getProperty(data.combat,  this.FLAG_OBJECTIFS)).reduce((acc, [key, val]) => {
                                if(key != uid) {
                                    acc[key] = val;
                                } else {
                                    acc["-=" + key] = null;
                                }
                                return acc;
                            }, {})});
                        }
                    }
                });
            };
        }
    }
}