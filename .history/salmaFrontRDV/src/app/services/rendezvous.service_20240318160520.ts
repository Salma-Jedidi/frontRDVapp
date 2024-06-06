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
  getRevenueForMedecin(cinMedecin: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/medecins/${cinMedecin}/revenue`);
  }

  
}
