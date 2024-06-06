import { Attachment } from '../models/Attachement'; // Adjust the path as needed
import { DossierMedical } from '../models/DossierMedical' ;


export interface Patient {
  idPatient: number;
  nomPatient: string;
  dateNaissance: Date;
  CIN: number;
  telephone: number;
  email: string;
  nomDelegation: string;a
  pieceJointe: Attachment[];
  role: string;
  typeCaisse: string;
  modePaiement: string;
  dossierMedical: DossierMedical[];
  dateCreation: Date;
}
