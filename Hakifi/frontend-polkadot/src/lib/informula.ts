import { InsuranceFormula } from 'hakifi-formula';

class Informula extends InsuranceFormula {
    private static instance: Informula;

    public static getInstance(): Informula {
        if (!Informula.instance) {
            Informula.instance = new Informula();
        }

        return Informula.instance;
    }
}

export const informula = Informula.getInstance();
