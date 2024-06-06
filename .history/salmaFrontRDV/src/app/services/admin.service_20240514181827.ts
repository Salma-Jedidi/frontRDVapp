import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { User } from '../models/User';
import { Medecin } from '../models/Medecin';
import { Delegation } from '../models/Delegation';
import { Etablissement } from '../models/Etablissement';
import { Patient } from '../models/Patient';
import { RDV } from '../models/RDV';
import { Gouvernorat } from '../models/Gouvernorat';
import { Specialite } from '../models/Specialite';
import { ServiceMed } from '../models/ServiceMed';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:8089/api/v1/auth/adminpage';

  constructor(private http: HttpClient) { }
  // User Management
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/adduser`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/updateUser`, user);
  }

  deleteUser(idUser: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteUser/${idUser}`);
  }

  affichUser(idUser: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/affichUser/${idUser}`)
    .pipe(
      tap(response => console.log('API Response:', response))
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/listUsers`);
  }
  getAllSpecialite(): Observable<Specialite[]> {
    return this.http.get<Specialite[]>(`${this.apiUrl}/listSpecialites`);
  }
  getAllServiceMedicales(): Observable<ServiceMed[]> {
    return this.http.get<ServiceMed[]>(`${this.apiUrl}/listServiceMed`);
  }
  getAllMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.apiUrl}/listMedecins`);
  }
  getAllDelegations(): Observable<Delegation[]> {
    return this.http.get<Delegation[]>(`${this.apiUrl}/listDelegations`);
  }

  getAllEtablissements(): Observable<Etablissement[]> {
    return this.http.get<Etablissement[]>(`${this.apiUrl}/listEtablissements`);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/listPatients`);
  }


  getAllRDVs(): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/listRDVs`);
  }
  addRDV(rdv: RDV): Observable<RDV> {
    return this.http.post<RDV>(`${this.apiUrl}/addrdv`, rdv);
  }
  checkAvailability(nomDuMedecin: string, dateRDV?: string, heureRDV?: string): Observable<boolean> {
    const url = `${this.apiUrl}/checkAvailability?nomDuMedecin=${nomDuMedecin}&dateRDV=${dateRDV}&heureRDV=${heureRDV}`;
    return this.http.get<boolean>(url);
  }

  suggestAvailableTimes(nomDuMedecin: string, dateRDV?: string, numberOfSuggestions?: number): Observable<string[]> {
    const url = `${this.apiUrl}/suggestTimes?nomDuMedecin=${nomDuMedecin}&dateRDV=${dateRDV}&numberOfSuggestions=${numberOfSuggestions}`;
    return this.http.get<string[]>(url);
  }

  updateRDV(rdv: RDV): Observable<RDV> {
    return this.http.put<RDV>(`${this.apiUrl}/updaterdv`, rdv);
  }

  deleteRDV(idRDV: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteRDV/${idRDV}`);
  }
// Medecin Management
addMedecin(medecin: Medecin): Observable<Medecin> {
  return this.http.post<Medecin>(`${this.apiUrl}/addmedecin`, medecin);
}

updateMedecin(cin:number,medecin: Medecin): Observable<Medecin> {
  return this.http.put<Medecin>(`${this.apiUrl}/updateMedecin/${cin}`, medecin);
}

deleteMedecin(idMedecin: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/deleteMedecin/${idMedecin}`);
}

affichMedecin(cinMedecin: number): Observable<Medecin> {
  return this.http.get<Medecin>(`${this.apiUrl}/affichMedecin/${cinMedecin}`);
}


// Delegation Management
addDelegation(delegation: Delegation): Observable<Delegation> {
  return this.http.post<Delegation>(`${this.apiUrl}/adddelegation`, delegation);
}

updateDelegation(delegation: Delegation): Observable<Delegation> {
  return this.http.put<Delegation>(`${this.apiUrl}/updateSubject`, delegation);
}

deleteDelegation(idDelegation: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/deleteDelegation/${idDelegation}`);
}

affichDelegation(codeDelegation: number): Observable<Delegation[]> {
  return this.http.get<Delegation[]>(`${this.apiUrl}/affichDelegation/${codeDelegation}`);
}


// Etablissement Management
addEtablissement(etablissement: Etablissement): Observable<Etablissement> {
  return this.http.post<Etablissement>(`${this.apiUrl}/addetablissement`, etablissement);
}

updateEtablissement(etablissement: Etablissement): Observable<Etablissement> {
  return this.http.put<Etablissement>(`${this.apiUrl}/updateEtablissement`, etablissement);
}

deleteEtablissement(idEtablissement: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/deleteEtablissement/${idEtablissement}`);
}

affichEtablissement(codeEtablissement: number): Observable<Etablissement[]> {
  return this.http.get<Etablissement[]>(`${this.apiUrl}/affichEtablissement/${codeEtablissement}`).pipe(
    catchError((error: any) => {
      console.error('Erreur HTTP lors de la récupération des détails de l\'établissement :', error);

      return [];
    })
  );
}

assignEtablissementToMedecin(idEtablissement: number, idMedecin: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/assignEtablissementToMedecin/${idEtablissement}/${idMedecin}`, null);
}

assignEtablissementToGouvernorat(idEtablissement: number, codeGouvernorat: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/assignEtablissementToGouvernorat/${idEtablissement}/${codeGouvernorat}`, null);
}

assignSpecialiteAndServiceToMedecin(idSpecialite: number, idService: number, idMedecin: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/assignSpecialiteAndServiceToMedecin/${idSpecialite}/${idService}/${idMedecin}`, null);
}
assignPatientAndMedecinTordv(nomDuPatient: string, nomDuMedecin: string, rdv: RDV): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/assignPatientAndMedecinTordv/${nomDuPatient}/${nomDuMedecin}`, rdv);
}

assignDelegationToGouvernorat(codeDelegation: number, codeGouvernorat: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/assignDelegationToGouvernorat/${codeDelegation}/${codeGouvernorat}`, null);
}



addGouvernorat(gouvernorat: Gouvernorat): Observable<Gouvernorat> {
  return this.http.post<Gouvernorat>(`${this.apiUrl}/addgouvernorat`, gouvernorat);
}

updateGouvernorat(gouvernorat: Gouvernorat): Observable<Gouvernorat> {
  return this.http.put<Gouvernorat>(`${this.apiUrl}/updateGouvernorat`, gouvernorat);
}

deleteGouvernorat(idGouvernorat: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/deleteGouvernorat/${idGouvernorat}`);
}

affichGouvernorat(idGouvernorat: number): Observable<Gouvernorat> {
  return this.http.get<Gouvernorat>(`${this.apiUrl}/affichGouvernorat/${idGouvernorat}`);
}

afficherRevenueDuMedecin(cinMedecin: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/votre-endpoint-spring-boot/${cinMedecin}`);
}
}