import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  /api/v1/medecin
  constructor() { }
  getRDVsForMedecin(cinMedecin: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/medecins/${cinMedecin}/rdvs`);
  }
}
