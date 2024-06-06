import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  /api/v1/medecin
 
  private apiUrl = 'http://localhost:8089/api/v1/auth/patient'; 

  constructor(private http: HttpClient) { }
  getRDVsForMedecin(cinMedecin: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/medecins/${cinMedecin}/rdvs`);
  }
}
