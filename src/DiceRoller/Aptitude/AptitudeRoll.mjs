
import * as system  from "../../_helpers.mjs";

export class AptitudeRoll extends Roll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/aptitude/roll-result.hbs";

    static fromData(data) {
        return super.fromData(data);
    }

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.isMJ = game.user.isGM;
        ret.title = this.options.title;
        ret.total = this.total;
        ret.result = this.getResult();
        ret.difficulte = this.options.rangDifficulte;
        ret.ptHeroisme = this.calculResult() >= 1 ? this.options.rangDifficulte : 0;
        ret.competence = this.options.competence;
        return ret;
    }

    calculResult()
    {
        return this.total - this.options.rangDifficulte;
    }
    getResult()
    {
        return this.calculResult() < 0 ? "Echec" : "Réussite";
    }

    async getTooltip() {
        const parts = this.dice.map(d => d.getTooltipData());
        return foundry.applications.handlebars.renderTemplate(this.constructor.TOOLTIP_TEMPLATE, {
            parts: game.user.isGM ? parts : parts.map(p => ({
                ...p, 
                formula: "",
                total: "",
                rolls: p.rolls.map(r => ({...r, classes: r.classes.replace("success", "")}))
            }))
        });
    }

}