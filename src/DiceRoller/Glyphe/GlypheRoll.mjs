
import * as system  from "../../_helpers.mjs";

export class GlypheRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/glyphe/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        if (this.options.alreadyAffectTempete == undefined) {
            this.options.alreadyAffectTempete = false;
        }
        
        if (this.options.alreadyRollEffect == undefined) {
            this.options.alreadyRollEffect = false;
        }
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});

        ret.difficulte = `${this.options.difficulte} - ${game.i18n.format("glyphes.common.difficulte." + system.Common.Difficultes.getKey(this.options.difficulte))}`;
        
        ret.echecs = this.dice[0].results.length - this.dice[0].total;
        ret.nbTempete = this.getNbTempete();
        ret.canAffectTempete = ret.echecs > 0 && fromUuidSync(this.options.actor).testUserPermission(game.user, "canUpdate");
        ret.alreadyAffectTempete = this.options.alreadyAffectTempete;

        ret.nbdepairimpair = this.getnbde(this.dice);

        ret.hasEffect = ret.nbdepairimpair.pair > ret.nbdepairimpair.impair && fromUuidSync(this.options.actor).testUserPermission(game.user, "canUpdate");
        ret.alreadyRollEffect = this.options.alreadyRollEffect;        

        ret.actor = this.options.actor;

        ret.totalpts = ret.total * ((this.options.difficulte -2) /2);

        return ret;
    }

    getnbde(dices)
    {
        let ret = {pair: 0, impair: 0};

        dices.forEach(onedice => {
            onedice.results.forEach( dice => {
                if(dice.result % 2 == 0)
                {
                    ret.pair ++;
                }
                else {
                    ret.impair ++;
                }
            });
        });

        return ret;
    }

    getNbTempete()
    {
        return Math.max(this.total == 0 ? this.options.difficulte : 0, this.dice[0].results.length - this.dice[0].total);
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