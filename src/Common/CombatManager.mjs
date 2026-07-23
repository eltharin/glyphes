import * as system  from "../_helpers.mjs";
import { CombatObjectif } from "./Combat/CombatObjectif.mjs";


export class CombatManager {

    static FLAG_OBJECTIFS = "flags." + system.Consts.SYSTEMID + ".objectifs";


    static init() {

        Hooks.on("preCreateCombat", (combat, change) => {

            if (!foundry.utils.getProperty(combat,  CombatManager.FLAG_OBJECTIFS)) {
                combat.updateSource({[CombatManager.FLAG_OBJECTIFS]: {}});
            }

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ alias: "" }),
                content: "Le combat commence"
            });

            
        });

        Hooks.on("renderCombatTracker", (app, html, data) => {

            console.log(app, html, data, data.combat?.flags);
            const header = html.querySelector(".combat-tracker-header");

            let objectifsContainer = header.querySelector(".combat-tracker-header-objectifs");

            if(data.combat == null) {
                objectifsContainer?.remove();
                return;
            }

            if (!objectifsContainer) {
                objectifsContainer = document.createElement("div");
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
                        ok: {
                            label: game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.dialog.btnAjout"),
                            },
                            submit: result => {
                                console.log(result);
                                let update = {};
                                const uid = foundry.utils.randomID();
                                update[CombatManager.FLAG_OBJECTIFS] = {
                                    ...foundry.utils.getProperty(data.combat,  CombatManager.FLAG_OBJECTIFS),
                                    [uid]: CombatObjectif.create(result.text, result.mask)
                                };
                                console.log(update)
                                data.combat.update(update);
                            }
                        });
                    };
                }

                const objectifsData = document.createElement("div");
                objectifsData.classList.add("combat-tracker-header-objectifs-list");
                objectifsContainer.appendChild(objectifsData);
            }

            const objectifsList = header.querySelector(".combat-tracker-header-objectifs-list");

            objectifsList.textContent = "";
            
            for(const [uid, obj] of Object.entries(foundry.utils.getProperty(data.combat,  CombatManager.FLAG_OBJECTIFS))) {
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
                            submit: result => {
                                data.combat.update({[CombatManager.FLAG_OBJECTIFS] : Object.entries(foundry.utils.getProperty(data.combat,  CombatManager.FLAG_OBJECTIFS)).reduce((acc, [key, val]) => {
                                    if(key != uid) {
                                        acc[key] = val;
                                    } else {
                                        acc[key] = {...val, ...result};
                                    }
                                    return acc;
                                }, {})});
                            }
                        });
                    };
                }
                
                if(game.user.isGM) {
                    const objectifItemSuppr = document.createElement("span");
                    objectifItemSuppr.textContent = "X";
                    objectifItem.appendChild(objectifItemSuppr);

                    objectifItemSuppr.onclick = async (e) => {
                        if(!game.user.isGM) return;
                        e.stopPropagation();

                        const dialog = await system.Base.Dialog.confirm({
                            content: game.i18n.localize(system.Consts.SYSTEMID + ".combat.objectifs.delete"),
                            submit: result => {
                                if (result) {
                                    data.combat.update({[CombatManager.FLAG_OBJECTIFS] : Object.entries(foundry.utils.getProperty(data.combat,  CombatManager.FLAG_OBJECTIFS)).reduce((acc, [key, val]) => {
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



/*            for (const li of html.querySelectorAll("li.combatant")) {
                const combatantId = li.dataset.combatantId;
                const combatant = game.combat.combatants.get(combatantId);

                const actor = combatant?.actor;
                if (!actor) continue;


                if(li.querySelectorAll(".pa-container").length == 0) {
                    // Conteneur
                    const paContainer = document.createElement("div");
                    paContainer.classList.add("pa-container");
                    
                    const paButton = document.createElement("div");
                    paButton.classList.add("pa-button");
                    paButton.innerHTML = foundry.utils.getProperty(combatant, CombatManager.getFlagPa());
                    paContainer.appendChild(paButton);

                    paButton.onclick = async (e) => {
                        if(!game.user.isGM) return;
                        e.stopPropagation();

                        const dialog = await system.Base.Dialog.input({
                            content: await foundry.applications.handlebars.renderTemplate(system.Consts.TEMPLATES_PATH + "/combat/popup-reset-pa.hbs", {
                                defaultPa: CombatManager.getNbPaStart(),
                             }),
                            window: {title: game.i18n.localize(system.Consts.SYSTEMID + ".combat.pa.title")},
                            ok: {
                                label: game.i18n.localize(system.Consts.SYSTEMID + ".combat.pa.buttons.changer"),
                            },
                            submit: result => {
                                combatant.update({[CombatManager.getFlagPa()]: result.pa})
                            }
                        });
                    };

                    li.insertBefore(paContainer, li.lastElementChild);
                }
            }*/
        });  
    }    
}