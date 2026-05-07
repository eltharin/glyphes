

export class Argent {
    static convertAtoB(argent) {
        argent = Number(argent);
        
        let bourse = {
            bronze: argent % 10,
            argent: (argent - (argent % 10)) / 10,
            argentglo: (argent - (argent % 10)) / 10,
        }

        let reste = bourse.argent;

        bourse.saphir = (bourse.argent - (bourse.argent % 500)) / 500;
        bourse.argent = bourse.argent - bourse.saphir * 500;

        bourse.rubis = (bourse.argent - (bourse.argent % 250)) / 250;
        bourse.argent = bourse.argent - bourse.rubis * 250;

        bourse.brume = (bourse.argent - (bourse.argent % 100)) / 100;
        bourse.argent = bourse.argent - bourse.brume * 100;


        return bourse;
    }

    static convertBtoA(obj) {
        return (5000 * Number(obj.saphir??0)) + (2500 * Number(obj.rubis??0)) + (1000 * Number(obj.brume??0)) + (10 * Number(obj.argent??0)) + (10 * Number(obj.argentglo??0)) + Number(obj.bronze??0);
    }
}
