


export class CombatObjectif {

    text = "";
    status = 0;
    mask = false;

    constructor(text, mask = false)
    {
        this.text = text;
        this.mask = mask;
    }

    static create(text, mask = false)
    {
        return new CombatObjectif(text,mask);
    }
}