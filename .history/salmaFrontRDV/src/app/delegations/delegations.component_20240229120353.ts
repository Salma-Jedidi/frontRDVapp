
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Delegation } from '../models/Delegation';
import { Gouvernorat } from '../models/Gouvernorat';
@Component({
  selector: 'app-delegations',
  templateUrl: './delegations.component.html',
  styleUrls: ['./delegations.component.css']
})
export class DelegationsComponent implements OnInit{
  gouvernorat:Gouvernorat={
    idGouvernorat:1,
  codeGouvernorat:1,
  libGouvernorat:'',
};
delegation :Delegation={
  idDelegation:1,
  codeDelegation:1,
  libDelegation:'',
  codeDuGouvernorat:1
};
delegations: Delegation[] = [];
gouvernorats:Gouvernorat[] = [];
searchDelegationId: any;
searchGouvernoratId:any;
gouvernoratForm: FormGroup;



  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.gouvernoratForm = this.fb.group({
      codeGouvernorat: ['', Validators.required],
      libGouvernorat: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.setupEventListeners();
    this.adminService.getAllDelegations().subscribe(delegations => this.delegations = delegations);
  }

  setupEventListeners() {
  document.querySelector(".jsFilter")?.addEventListener("click", () => {
    document.querySelector(".filter-menu")?.classList.toggle("active");
  });

  document.querySelector(".grid")?.addEventListener("click", () => {
    document.querySelector(".list")?.classList.remove("active");
    document.querySelector(".grid")?.classList.add("active");
    document.querySelector(".products-area-wrapper")?.classList.add("gridView");
    document.querySelector(".products-area-wrapper")?.classList.remove("tableView");
  });

  document.querySelector(".list")?.addEventListener("click", () => {
    document.querySelector(".list")?.classList.add("active");
    document.querySelector(".grid")?.classList.remove("active");
    document.querySelector(".products-area-wrapper")?.classList.remove("gridView");
    document.querySelector(".products-area-wrapper")?.classList.add("tableView");
  });
}

  addDelegation() {
    this.adminService.addDelegation(this.delegation).subscribe(
      (addedDelegation: Delegation) => {
        console.log('Delegation added successfully:', addedDelegation);
      },
      (error) => {
        console.error('Error adding Delegation:', error);
      }
    );
  }
  updateDelegation() {
    this.adminService.updateDelegation(this.delegation).subscribe(
      (updatedDelegation: Delegation) => {
        console.log('Delegation updated successfully:', updatedDelegation);
      },
      (error) => {
        console.error('Error updating delegation:', error);
      }
    );
  }
  
  deleteDelegation(idDelegation: number) {
    this.adminService.deleteDelegation(idDelegation).subscribe(
      () => {
        console.log('Delegation deleted successfully');
      },
      (error) => {
        console.error('Error deleting delegation:', error);
      }
    );
  }
  
  affichDelegation(codeDelegation: number) {
    this.adminService.affichDelegation(codeDelegation).subscribe(
      (response: Delegation | Delegation[]) => {
        if (Array.isArray(response)) {
          this.delegations = response;
        } else {
          this.delegations = [response];
        }
  
        if (this.delegations.length === 0) {
          console.log('Delegation not found.');
        }
      },
      (error: any) => {
        console.error('Error fetching delegation details:', error);
      }
    );
  }
  
  
  getAllDelegations() {
    this.adminService.getAllDelegations().subscribe(
      (delegations: Delegation[]) => {
        this.delegations = delegations;
      },
      (error: any) => {
        console.error('Error fetching delegations:', error);
      }
    );
  }
  addGouvernorat() {
    this.adminService.addGouvernorat(this.gouvernorat).subscribe(
      (addedGouvernorat: Gouvernorat) => {
        console.log('Gouvernorat added successfully:', addedGouvernorat);
      },
      (error) => {
        console.error('Error adding Gouvernorat', error);
      }
    );
  }
  updateGouvernorat() {
    this.adminService.updateGouvernorat(this.gouvernorat).subscribe(
      (updatedGouvernorat: Gouvernorat) => {
        console.log('Gouvernorat updated successfully:', updatedGouvernorat);
      },
      (error) => {
        console.error('Error updating Gouvernorat:', error);
      }
    );
  }
  
  deleteGouvernorat(idGouvernorat: number) {
    this.adminService.deleteGouvernorat(idGouvernorat).subscribe(
      () => {
        console.log('Gouvernorat deleted successfully');
      },
      (error) => {
        console.error('Error deleting Gouvernorat:', error);
      }
    );
  }
  
  affichGouvernorat() {
    this.adminService.affichGouvernorat(this.searchDelegationId).subscribe(
      (response: Gouvernorat[] | Gouvernorat) => {
        if (Array.isArray(response) && response.length > 0) {
          this.gouvernorats = response;
        } else {
          this.gouvernorats = [];
          console.log('Gouvernorat not found.');
        }
      },
      (error: any) => {
        console.error('Error fetching Gouvernorat details:', error);
      }
    );
  }
  
  
  assignDelegationToGouvernorat() {
    this.adminService.assignDelegationToGouvernorat(this.searchDelegationId, this.searchGouvernoratId).subscribe(
      () => {
        console.log("Code Gouvernorat:", this.gouvernorat.codeGouvernorat);

        console.log('Délégation affectée avec succès au gouvernorat.');
          },
      error => {
        console.error('Erreur lors de l\'affectation de la délégation au gouvernorat : ', error);
         }
    );
  
  }
  
}