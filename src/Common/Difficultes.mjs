export class Difficultes {


    static difficultes = {
        commun    : {value: 4 , isDefault:true},
        heroique  : {value: 6 , isDefault:false},
        grandiose : {value: 8 , isDefault:false},
        legendaire: {value: 10, isDefault:false},
        mythique  : {value: 12, isDefault:false},
    };

    static getKey(maVal) {
        const entree = Object.entries(this.difficultes).find(
            ([cle, objet]) => objet.value == maVal
        );
        console.log(maVal, entree)
        return entree ? entree[0] : null;
    }
}