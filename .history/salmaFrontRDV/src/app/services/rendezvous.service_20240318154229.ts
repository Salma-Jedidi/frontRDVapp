import { Injectable } from '@angular/core';
import { RDV } from '../models/RDV';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  
 
  private apiUrl = 'http://localhost:8089/api/v1/medecin'; 
  private apiUrl = 'http://localhost:8089/api/v1/auth/patient'; 

  constructor(private http: HttpClient) { }

  getRDVsForMedecin(cinMedecin: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/medecins/${cinMedecin}/rdvs`);
  }
}
