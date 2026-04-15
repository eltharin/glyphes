


export class ValeurDe{
    
    static ordre = [4,6,8,10,12];

    static list = {
        4 : "D4",
        6 : "D6",
        8 : "D8",
        10: "D10",
        12: "D12",
    };

    static getPrev(valeur){
        const index = this.ordre.indexOf(valeur);
        if(index == -1)
        {
            console.error("Valeur non trouvée");
            return null;
        }
        if(index == 0)
        {
            console.error("Valeur min atteinte");
            return this.ordre[0];
        }

        return this.ordre[index-1];
    }

    static getNext(valeur){
        const index = this.ordre.indexOf(valeur);
        console.log(index)
        if(index == -1)
        {
            console.error("Valeur non trouvée");
            return null;
        }
        if(index == this.ordre.length-1)
        {
            console.error("Valeur max atteinte");
            return this.ordre[this.ordre.length-1];
        }

        return this.ordre[index+1];
    }
}