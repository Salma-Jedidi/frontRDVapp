import { Document } from '../models/Document' ;


export interface Patient {
  idPatient: number;
  nomPatient: string;
  dateNaissance: Date;
  cin: number;
  telephone: number;
  email: string;
  nomDelegation: string
  role: string;
  typeCaisse: string;
  modePaiement: string;
  dateCreation: Date;
}
