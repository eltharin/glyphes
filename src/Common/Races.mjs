
class Race {
    modificateurs= {};

    get id(){
        return this._id;
    }
     
    get name(){
        return this.name;
    }

    get effets(){
        return [];
    }
}

class HumainRace extends Race{
    _id = "humain";
    name = "humain";
    modificateurs= [
        "+1ND dans 2 caractéristiques",
        "1 Niv d'aptitude suppl"
    ];
}

class GourmetRace extends Race{
    _id = "gourmet";
    name = "gourmet";
    
}

class MedeinitesRace extends Race{
    _id = "medeinites";
    name = "medeinites";
    
}

class ArboreidesRace extends Race{
    _id = "arboreides";
    name = "arboreides";
    
}

class FeeRace extends Race{
    _id = "fee";
    name = "fee";
    
}

class OmbreRace extends Race{
    _id = "ombre";
    name = "ombre";
    modificateurs= {
        sens: {
            ouie: {
                nb: 1
            }
        }
    };
}

class HybridesRace extends Race{
    _id = "hybrides";
    name = "hybrides";
    
}

class CervideRace extends Race{
    _id = "cervide";
    name = "cervide";
    modificateurs= {
        sens: {
            instinct: {
                nb: 1
            }
        }
    };
}

class LycanRace extends Race{
    _id = "lycan";
    name = "lycan";
    modificateurs= {
        sens: {
            vue: {
                nb: 1
            }
        }
    };
}

class UrsideRace extends Race{
    _id = "urside";
    name = "urside";
    
}

class FelinRace extends Race{
    _id = "felin";
    name = "felin";
    modificateurs= {
        sens: {
            vue: {
                nb: 1
            }
        }
    };
}

export class Races {
    static races = {
        humain : HumainRace,
        gourmet : GourmetRace,
        //medeinites : MedeinitesRace,
        arboreides : ArboreidesRace,
        fee: FeeRace,
        ombre: OmbreRace,
        //hybrides: HybridesRace,
        cervide: CervideRace,
        lycan: LycanRace,
        urside: UrsideRace,
        felin: FelinRace,
    };

    static get(raceId) {
        if(this.races[raceId] !== undefined)
        {
            return new this.races[raceId];
        }
        return null;
    }

    static list(){
        let ret = [];
        Object.values(this.races).forEach(element => {
            ret.push(new element);
        });

        return ret;
    }
}