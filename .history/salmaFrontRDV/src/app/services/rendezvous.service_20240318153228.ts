import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {

  constructor() { }
  getRDVsForPatient(cinPatient: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/patients/${cinPatient}/rdvs`);
  }
}
