import { Attachment } from '../models/Attachement'; // Adjust the path as needed
import { DossierMedical } from '../models/DossierMedical' ;


export interface Patient {
  idP
  nomPatient: string;
  dateNaissance: Date;
  CIN: number;
  telephone: number;
  email: string;
  nomDelegation: string;
  pieceJointe: {
      // Propriétés de l'objet PieceJointe
  };
  role: string;
  typeCaisse: string;
  modePaiement: string;
  dossierMedical: {
      // Propriétés de l'objet DossierMedical
  };
  dateCreation: Date;
}
