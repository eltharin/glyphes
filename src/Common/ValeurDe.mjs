


export class ValeurDe{
    
    static dices = [
        {faces: 4,  label: "D4", icon: "systems/glyphes/assets/dice/d4.svg?n=" + Date.now() + "#icon"},
        {faces: 6,  label: "D6", icon: "systems/glyphes/assets/dice/d6.svg?n=" + Date.now() + "#icon"},
        {faces: 8,  label: "D8", icon: "systems/glyphes/assets/dice/d8.svg?n=" + Date.now() + "#icon"},
        {faces: 10, label: "D10", icon: "systems/glyphes/assets/dice/d10.svg?n=" + Date.now() + "#icon"},
        {faces: 12, label: "D12", icon: "systems/glyphes/assets/dice/d12.svg?n=" + Date.now() + "#icon"},
    ];

    static getVal(index) {
        return this.dices[index].faces;
    }

    static getIcon(index) {
        return this.dices[index].icon;
    }

    static getPrev(index) {
        
        if(! index in Object.keys(this.dices))
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
        if(! index in Object.keys(this.dices))
        {
            console.error("Valeur non trouvée");
            return null;
        }
        if(index >= this.dices.length-1)
        {
            console.error("Valeur max atteinte");
            return this.dices.length-1;
        }

        return index+1;
    }
}