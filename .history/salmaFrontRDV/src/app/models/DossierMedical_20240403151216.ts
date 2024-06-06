export interface DossierMedical {

        idDossier: number;
        etatClinique: string;
        groupe_sanguin: string;
        allergie: string;
        prescriptions_therapeutiques: string;
        resultats_examen: string;
        observations: string;
        nomDuPatient: string;
        dateNaissancePatient?: string;
        cinPatient: number;
        telephonePatient: number;
      }