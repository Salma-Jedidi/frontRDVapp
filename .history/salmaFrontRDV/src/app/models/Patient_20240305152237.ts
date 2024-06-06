import { Attachment } from '../models/Attachement'; // Adjust the path as needed
import { DossierMedical } from '../models/DossierMedical' ;


export interface Patient {
  idPatient: number;
  nomPatient: string;
  dateNaissance: Date;
  cin: number;
  telephone: number;
  email: string;
  nomDelegation: string
  pieceJointe: Document ;
  role: string;
  typeCaisse: string;
  modePaiement: string;
  dossierMedical: Document ;
  dateCreation: Date;
}
