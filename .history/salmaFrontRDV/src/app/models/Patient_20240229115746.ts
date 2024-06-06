import { Attachment } from '../models/Attachement'; // Adjust the path as needed
import { DossierMedical } from '../models/DossierMedical' ;


export interface Patient {
    idPatient: number;
    nomPatient: string;
    dateNaissance: Date;
    CIN: number;
    telephone: number;
    email: string;
    codeSpecialite: string;
    codeDelegation: string;
    codeService: string;
    pieceJointe: Attachment;
    role: string;
    typeCaisse: string;
    modePaiement: string;
    rdvs: any[]; // Adjust the type based on your RDV entity
    dossierMedical: DossierMedical;
    password: string;
    dateCreation: Date;
  }
  