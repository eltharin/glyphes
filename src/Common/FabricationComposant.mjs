


export class FabricationComposant {


    static zone = {
        "unique": {
            cout: 0,
            distance: 0,
        },
        "5ft": {
            cout: 1,
            distance: 5,
        },
        "10ft": {
            cout: 2,
            distance: 10,
        },
        "15ft": {
            cout: 3,
            distance: 15,
        },
    }

    static duree = {
        "instant": {
            cout: 0,
            duree: 0,
        },
        "1minute": {
            cout: 1,
            duree: 1,
        },
        "15minutes": {
            cout: 2,
            duree: 15,
        },
        "1heure": {
            cout: 3,
            duree: 60,
        },
    }

    static temps = {
        "1jour": {
            cout: -1,
        },
        "activitec": {
            cout: 0,
        },
        "activitec2": {
            cout: 1,
        },
        "activitec3": {
            cout: 2,
        },
        "activites": {
            cout: 3,
        },
    }

    static magnitude = {
        commun : {score:4},
        heroique : {score:6},
        grandiose : {score:8},
        legendaire : {score:10},
        mythique : {score:12},
    }
}