import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {

  constructor() { }
  getRDVsForMedecin(cinMedecin: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/medecins/${cinMedecin}/rdvs`);
  }
}
