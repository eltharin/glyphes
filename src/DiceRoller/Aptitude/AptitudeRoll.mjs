
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
        ret.total = this.total;
        ret.result = this.getResult();
        ret.difficulte = this.options.rangDifficulte;
        ret.ptHeroisme = this.getResult() >= 1 ? this.options.rangDifficulte : 0;
        return ret;
    }

    getResult()
    {
        const resValue = this.total - this.options.rangDifficulte;

        return resValue < 0 ? "Echec" : "Réussite";
    }

}