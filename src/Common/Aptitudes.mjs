


export class Aptitudes {


    static categories = {
        "martiales": [
            "armeslegeresmelee",
            "armeslourdesmelee",
            "armeslegeresdistance",
            "armeslourdesdistance",
            "pugilat",
            "armesjet",
        ],
        "furtivite": [
            "camouflage",
            "mainlegere",
        ],
        "foi": [
            "courageux",
            null,
        ],
        "evocation": [
            "forgeglyphe",
            null,
        ],
        "physique": [
            "athletique",
            "piedleger",
            "sangpourri",
        ],
        "survie": [
            "medecin",
            "scout",
            "vigilant",
        ],
        "creation": [
            "alchimiste",
            "ingenieur",
        ],
        "connaissances": [
            "botanique",
            "deduction",
            "erudition",
            "traqueur",
        ],
        "social": [
            "charme",
            "intimidation",
            "negociateur",
            "persuasion",
            "tromperie",
        ],
    }
    static list = {
        armeslegeresmelee: {
            competences: ["souplesse", "puissance"],
        },
        armeslourdesmelee: {
            competences: ["puissance"]
        },
        armeslegeresdistance: {
            competences: ["souplesse"]
        },
        armeslourdesdistance: {
            competences: ["souplesse"]
        },
        pugilat: {
            competences: ["souplesse", "puissance"]
        },
        armesjet: {
            competences: ["souplesse", "puissance"]
        },
        camouflage: {
            competences: ["souplesse"]
        },
        mainlegere: { 
            competences: ["souplesse"]
        },
        courageux: {
            competences: ["foi"]
        },
        forgeglyphe: {
            competences: ["esprit"]
        },
        athletique: {
            competences: ["puissance"]
        },
        piedleger: {
            competences: ["souplesse"]
        },
        sangpourri: {
            competences: ["constitution"]
        },
        medecin: {
            competences: ["esprit", "souplesse"]
        },
        scout: {
            competences: ["esprit"]
        },
        vigilant: {
            competences: ["esprit"]
        },
        alchimiste: {
            competences: ["esprit", "souplesse"]
        },
        ingenieur: {
            competences: ["esprit", "souplesse"]
        },
        botanique: {
            competences: ["esprit"]
        },
        deduction: {
            competences: ["esprit"]
        },
        erudition: {
            competences: ["foi", "esprit"]
        },
        traqueur: {
            competences: ["esprit"]
        },
        charme: {
            competences: ["social", "souplesse"]
        },
        intimidation: {
            competences: ["social", "puissance"]
        },
        negociateur: {
            competences: ["social", "esprit"]
        },
        persuasion: {
            competences: ["foi", "social", "esprit"]
        },
        tromperie: {
            competences: ["social", "esprit"]
        },
        

    }

    static getApt(apt)
    {
        return this.list[apt] ?? null;
    }
}