


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
        "creation": [
            "alchimiste",
            "ingenieur",
        ],
        "survie": [
            "survie",
            "medecin",
            "observateur",
            "vigilant",
        ],
        "connaissances": [
            "deduction",
            "erudition",
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
            sens: ["flux"]
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
        observateur: {
            sens: ["vue", "instinct"],
            mustChoose: true
        },
        vigilant: {
            sens: ["vue", "ouie", "flux", "instinct"],
            competencesText: "sens.choix",
            mustChoose: true
        },
        alchimiste: {
            competences: ["esprit", "souplesse"]
        },
        ingenieur: {
            competences: ["esprit", "souplesse"]
        },
        survie: {
            sens: ["vue", "ouie", "flux", "instinct"],
            mustChoose: true
        },
        deduction: {
            competences: ["esprit"]
        },
        erudition: {
            competences: ["foi", "esprit"]
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