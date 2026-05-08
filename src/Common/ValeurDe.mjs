


export class ValeurDe{
    
    static ordre = [4,6,8,10,12];

    static list = {
        4 : "D4",
        6 : "D6",
        8 : "D8",
        10: "D10",
        12: "D12",
    };

    static icons = {
        4 : "systems/glyphes/assets/dice/d4.svg?n=" + Date.now() + "#icon",
        6 : "systems/glyphes/assets/dice/d6.svg?n=" + Date.now() + "#icon",
        8 : "systems/glyphes/assets/dice/d8.svg?n=" + Date.now() + "#icon",
        10: "systems/glyphes/assets/dice/d10.svg?n=" + Date.now() + "#icon",
        12: "systems/glyphes/assets/dice/d12.svg?n=" + Date.now() + "#icon",
    };

    static getVal(index) {
        return this.ordre[index];
    }

    static getIcon(index) {
        return this.icons[index];
    }

    static getPrev(index) {
        
        if(! index in Object.keys(this.ordre))
        {
            console.error("Valeur non trouvée");
            return null;
        }
        if(index == 0)
        {
            console.error("Valeur min atteinte");
            return 0;
        }

        return index-1;
    }

    static getNext(index){
        //const index = this.ordre.indexOf(valeur);
        if(! index in Object.keys(this.ordre))
        {
            console.error("Valeur non trouvée");
            return null;
        }
        if(index >= this.ordre.length-1)
        {
            console.error("Valeur max atteinte");
            return this.ordre.length-1;
        }

        return index+1;
    }
}