

class Don {
    get id(){
        return this._id;
    }
     
    get name(){
        return "glyphes.dons." + this._id + ".name";
    }
     
    get description(){
        return "glyphes.dons." + this._id + ".description";
    }

    get effets(){
        return [];
    }
}

class StrategeDon extends Don {
    _id = "stratege";
}

class EcorcheurDon extends Don {
    _id = "ecorcheur";
}

class CombattantDon extends Don {
    _id = "combattant";
}

class FidelecompagnonDon extends Don {
    _id = "fidelecompagnon";
}

class CourageradiantDon extends Don {
    _id = "courageradiant";
}

class ChoisiDon extends Don {
    _id = "choisi";
}

class ToujourspretDon extends Don {
    _id = "toujourspret";
}

class EvocateurofficielDon extends Don {
    _id = "evocateurofficiel";
    _name= "Coucou"
}

class EvocateursauvageDon extends Don {
    _id = "evocateursauvage";
}

class MarqueDon extends Don {
    _id = "marque";
}

class AraigneeDon extends Don {
    _id = "araignee";
}

class ReveurDon extends Don {
    _id = "reveur";
}

class VisageDon extends Don {
    _id = "visage";
}

class LinguisteDon extends Don {
    _id = "linguiste";
}

class ExpertcreatureDon extends Don {
    _id = "expertcreature";
}

class InsaisissableDon extends Don {
    _id = "insaisissable";
}




export class Dons {
    static dons = {
        stratege: StrategeDon,
        ecorcheur: EcorcheurDon,
        combattant: CombattantDon,
        fidelecompagnon: FidelecompagnonDon,
        courageradiant: CourageradiantDon,
        choisi: ChoisiDon,
        toujourspret: ToujourspretDon,
        evocateurofficiel: EvocateurofficielDon,
        evocateursauvage: EvocateursauvageDon,
        marque: MarqueDon,
        araignee: AraigneeDon,
        reveur: ReveurDon,
        visage: VisageDon,
        linguiste: LinguisteDon,
        expertcreature: ExpertcreatureDon,
        insaisissable: InsaisissableDon,
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