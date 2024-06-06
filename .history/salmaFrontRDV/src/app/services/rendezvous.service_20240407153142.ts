import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RDV } from '../models/RDV';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  
 
  private apiUrl = 'http://localhost:8089/api/v1/auth/medecin'; 


  constructor(private http: HttpClient) { }

  getRDVsForMedecin(cinMedecin: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/medecins/${cinMedecin}/rdvs`);
  }
  getRevenueForMedecin(cinMedecin: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/medecins/${cinMedecin}/revenue`);
  }

  marquerEtatRDV(idRDV: number, nouvelEtat: string, cinMedecin: number) {
    return this.http.put(`${this.apiUrl}/rdvs/${idRDV}/etat/${nouvelEtat}?cinMedecin=${cinMedecin}`, {});
  }
  
  marquerPaiement(idRDV: number, paiementRDV: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${idRDV}/paiementrdv?paiementRDV=${paiementRDV}`, {});
  }
  
  getRDVPayes(): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/payes`);
  }

  getRDVNonPayes(): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/nonPayes`);
  }
  
}
