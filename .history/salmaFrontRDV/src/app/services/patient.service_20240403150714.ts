import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Patient } from '../models/Patient';
import { Medecin } from '../models/Medecin';
import { RDV } from '../models/RDV';
import { DossierMedical } from '../models/DossierMedical';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8089/api/v1/auth/patient'; 

  constructor(private http: HttpClient) { }

  choisirModePaiement(cin: number, modePaiement: string, typeCaisse: string): Observable<string> {
    const url = `${this.apiUrl}/${cin}/mode-paiement/type-caisse?modePaiementChoisi=${modePaiement}&typeCaisse=${typeCaisse}`;
    return this.http.post<string>(url, null);
  }
  
  addPatient(patient: Patient): Observable<Patient> {
   return this.http.post<Patient>(`${this.apiUrl}/addpatient`, patient);
  }

  updatePatient(cinPatient: number, updatedPatient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/updatePatien/${cinPatient}`, updatedPatient);
  }

  deletePatient(cin: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletePatient/${cin}`);
  }

  affichPatient(idPatient: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/affichPatient/${idPatient}`)
    .pipe(
      tap(response => console.log('API Response:', response))
    );
  }
  searchMedecin(delegation: string, libelleService: string, libelleSpecialite: string): Observable<Medecin[]> {
    // Ajoutez les paramètres nécessaires à la requête
    const params = {
      delegation: delegation,
      libelleService: libelleService,
      libelleSpecialite: libelleSpecialite
    };
    console.log('Search Medecin called with:', delegation, libelleService, libelleSpecialite);


    // Ajoutez les headers nécessaires, si nécessaire
    const headers = new HttpHeaders();

    // Effectuez la requête HTTP GET
    return this.http.get<Medecin[]>(`${this.apiUrl}/medecin/search`, { params: params, headers: headers });
  }
  getRendezVousPassesPourPatient(CIN: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/rdv/passes/${CIN}`);
  }
  
  getRendezVousAVenirPourPatient(CIN: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/rdv/avenir/${CIN}`);
  }

  addDocument(file: File, patientCIN: number): Observable<Document> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
  
    return this.http.post<Document>(`${this.apiUrl}/patient/addDocument/${patientCIN}`, formData);
  }
  getDocument(patientCIN: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/patient/${patientCIN}`, { responseType: 'blob' });
  }

  getRDVsForPatient(cinPatient: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/patients/${cinPatient}/rdvs`);
  }
  
  associerDossierMedicalAuPatient(cin: number, dossierMedical: DossierMedical): Observable<DossierMedical> {
    return this.http.post<DossierMedical>(`${this.apiUrl}/${cin}/dossier-medical`, dossierMedical)
 
  }

  getDossierMedicalByCin(cin: number): Observable<DossierMedical> {
    return this.http.get<DossierMedical>(`${this.apiUrl}/${cin}/dossier-medical`)
    
  }


}
