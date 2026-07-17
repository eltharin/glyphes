
import * as system  from "../../_helpers.mjs";

export class GlypheRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/glyphe/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        if (this.options.alreadyAffectTempete == undefined) {
            this.options.alreadyAffectTempete = false;
        }
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        
        ret.echecs = this.dice[0].results.length - this.dice[0].total;
        ret.canAffectTempete = fromUuidSync(this.options.actor).testUserPermission(game.user, "canUpdate");
        ret.alreadyAffectTempete = this.options.alreadyAffectTempete;
        ret.actor = this.options.actor;

        return ret;
    }

    async getTooltip() {
        const parts = this.dice.map(d => d.getTooltipData());

        return foundry.applications.handlebars.renderTemplate(this.constructor.TOOLTIP_TEMPLATE, {
            parts: parts.map(p => ({
                ...p, 
                formula: p.flavor + " : " + p.formula,
                flavor: "",
            }))
        });
    }

}