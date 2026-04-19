

class ActionHeroique {
    get id(){
        return this._id;
    }
     
    get name(){
        return "glyphes.actionsheroiques." + this._id + ".name";
    }
     
    get effet(){
        return "glyphes.actionsheroiques." + this._id + ".effet";
    }

    get cout(){
        return this._cout;
    }

    get destination(){
        return this._destination || [];
    }
}

class ChargeHeroiqueActionHeroique extends ActionHeroique {
    _id = "chargeheroique";
    _cout = 3;
    _destination = ["actor"];
}

class CharmeDivinActionHeroique extends ActionHeroique {
    _id = "charmedivin";
    _cout = 2;
    _destination = ["actor"];
}

class CriRalliementActionHeroique extends ActionHeroique {
    _id = "criteralliement";
    _cout = 4;
    _destination = ["actor"];
}

class InspirationHeroiqueActionHeroique extends ActionHeroique {
    _id = "inspirationheroique";
    _cout = 4;
    _destination = ["actor"];
}

class MortAttendraActionHeroique extends ActionHeroique {
    _id = "mortattendra";
    _cout = 5;
    _destination = ["actor"];
}

class PersuasionNaturelleActionHeroique extends ActionHeroique {
    _id = "persuasionnaturelle";
    _cout = 2;
    _destination = ["actor"];

}

class PresenceMenacanteActionHeroique extends ActionHeroique {
    _id = "presencemenacante";
    _cout = 2;
    _destination = ["actor"];
}

class VitesseMonstrueuseActionHeroique extends ActionHeroique {
    _id = "vitessemonstrueuse";
    _cout = 2;
    _destination = ["actor"];
}

class SerrerDentsActionHeroique extends ActionHeroique {
    _id = "serrerdents";
    _cout = 2;
    _destination = ["actor"];
}




export class ActionsHeroiques {
    static dons = {
        chargeheroique: ChargeHeroiqueActionHeroique,
        charmedivin: CharmeDivinActionHeroique,
        criteralliement: CriRalliementActionHeroique,
        inspirationheroique: InspirationHeroiqueActionHeroique,
        mortattendra: MortAttendraActionHeroique,
        persuasionnaturelle: PersuasionNaturelleActionHeroique,
        presencemenacante: PresenceMenacanteActionHeroique,
        vitessemonstrueuse: VitesseMonstrueuseActionHeroique,
        serrerdents: SerrerDentsActionHeroique,
    };

    static get(donId) {
        if(this.dons[donId] !== undefined)
        {
            return new this.dons[donId];
        }
        return null;
    }

    static list(){
        let ret = [];
        Object.values(this.dons).forEach(element => {
            ret.push(new element);
        });

        return ret;
    }
}