import { Component, OnInit } from '@angular/core';
import { RDV } from '../models/RDV';
import { Patient } from '../models/Patient';
import { Medecin } from '../models/Medecin';
import { Delegation } from '../models/Delegation';
import { Specialite } from '../models/Specialite';
import { ServiceMed } from '../models/ServiceMed';
import { PatientService } from '../services/patient.service';
import { AdminService } from '../services/admin.service';
import Chart from 'chart.js/auto';
import { DossierMedical } from '../models/DossierMedical';
import { Etablissement } from '../models/Etablissement';
import { RendezvousService } from '../services/rendezvous.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-secretaire',
  templateUrl: './secretaire.component.html',
  styleUrls: ['./secretaire.component.css']
})
export class SecretaireComponent implements OnInit{
  selectedPaiement: string = '';
  cinPatient: any;
 
  patient:Patient={
      idPatient: 0,
      nomPatient: '',
      dateNaissance: undefined,
      cin: 0,
      telephone: 0,
      email: '',
      nomDelegation: '',
      role: 'PATIENT',
      typeCaisse: 'CNRPS',
      modePaiement: 'Especes',
      dateCreation: undefined,
      
    };
    rdv: RDV = {
      idRDV: 0,
      dateRDV: undefined,
      heureRdv: undefined,
      remarques: '',
      etatRDV:'',
      nomDuPatient:'',
      nomDuMedecin:'',
      nomDelegation:'',
      paiementRDV:''
    };
    medecin: Medecin = {
      idMedecin: 0,
      nomMedecin: '',
      cinMedecin: 0,
      tel: '',
      prixConsultation: 0,
      etatMedecin: 0,
      libelleSpecialite: '',
      libelleService: '',
      nomDeletablissement: '',
      delegationMedecin: ''
    };
     rdvs: RDV[] = [];
     patients:Patient[]=[];
     rdvPasses: RDV[] = [];
     rdvAVenir: RDV[] = [];
     selectedStartDate: Date | null = null;
     selectedEndDate: Date | null = null;
    medecins: Medecin[] = [];
    delegations: Delegation[] = [];
    specialites: Specialite[] = [];
    services: ServiceMed[] = [];
    specialite: Specialite = {
      idSpecialite: 0,
      codeSpecialite: '',
      libSpecialite:''
    };
    service: ServiceMed = {
      idService: 0,
      codeService: '',
      libService:''
    };
  
 
    delegation :Delegation={
      idDelegation:1,
      codeDelegation:1,
      libDelegation:'',
      codeDuGouvernorat:1
    };
  
    selectedDelegation: any;
    dossierMedical: DossierMedical = {
      idDossier: 0,
      etatClinique: '',
      groupe_sanguin: '',
      allergie: '',
      prescriptions_therapeutiques: '',
      resultats_examen: '',
      observations: '',
      nomDuPatient: '',
      dateNaissancePatient: undefined,
      cinPatient: 1,
      telephonePatient: 1
    };
 

  searchMedecinCIN: any;

  specialiteId: any;
  serviceId: any;
  medecinId: any;
  patientId: any;
  rdvId:any;
  etablissementId:any;
 medId:any;
   etablissement:Etablissement={
  idEtablissement:0,
    codeEtablissement: 0,
    libEtablissement:''

};
etablissements:Etablissement[]=[];
selectedetablissement:any;
selectedSpecialite: any;
rendezVousList: any;
rdvPayes: RDV[]=[];
rdvNonPayes: RDV[]=[];
nombreRDVAcceptes: number = 0;
nombreRDVAnnules: number = 0;
nombreRDVEnInstant: number = 0;
nombreRDVModifies: number = 0;

  constructor(private patientService: PatientService,private adminService:AdminService,private rdvService:RendezvousService) { }
  ngOnInit(): void {
    this.adminService.getAllDelegations().subscribe(delegations => this.delegations = delegations);
    this.adminService.getAllSpecialite().subscribe(specialites => this.specialites =specialites);
    this.adminService.getAllServiceMedicales().subscribe(services=>this.services=services);
    this.getAllRDVs();
    this.getAllPatients();
    this.getRDVPayes();
    this.getRDVNonPayes();
    forkJoin([
      this.patientService.getNombreRDVByEtat('ACCEPTER'),
      this.patientService.getNombreRDVByEtat('ANNULER'),
      this.patientService.getNombreRDVByEtat('ENINSTANT'),
      this.patientService.getNombreRDVByEtat('MODIFIER')
    ]).subscribe(([acceptes, annules, enInstant, modifies]) => {
      this.nombreRDVAcceptes = acceptes;
      this.nombreRDVAnnules = annules;
      this.nombreRDVEnInstant = enInstant;
      this.nombreRDVModifies = modifies;
  
      // Une fois que tous les nombres sont récupérés, appelez ngAfterViewInit pour créer les graphiques
      this.ngAfterViewInit();
    });
    
  }
  getAllPatients() {
    this.adminService.getAllPatients().subscribe(
      (patients: Patient[]) => {
        this.patients = patients;
      },
      (error: any) => {
        console.error('Error fetching patients:', error);
      }
    );
  }
  choisirModePaiement(): void {
    this.patientService.choisirModePaiement(this.patient.cin, this.patient.modePaiement, this.patient.typeCaisse).subscribe(response => {
      console.log(response); // Gérez la réponse comme vous le souhaitez
    });
  }
  addPatient() {
    // Assuming you have a patient object ready to be added
    this.patientService.addPatient(this.patient).subscribe(
      (addedPatient: Patient) => {
        console.log('Patient added successfully:', addedPatient);
      },
      (error) => {
        console.error('Error adding Patient:', error);
      }
    );
  }
  
  updatePatient(): void {
    this.patientService.updatePatient(this.patient.cin, this.patient)
      .subscribe(
        (updatedPatientResponse) => {
          console.log('Patient updated successfully:', updatedPatientResponse);
          // You can perform additional actions upon successful update
        },
        (error) => {
          console.error('Error updating Patient:', error);
          // Handle the error, e.g., display an error message to the user
        }
      );
  }
  
  

  deletePatient() {
    this.patientService.deletePatient(this.patient.cin).subscribe(
      () => {
        console.log('Patient deleted successfully');
        // Additional logic if needed
      },
      (error) => {
        console.error('Error deleting Patient:', error);
      }
    );
  }
  
  associerDossierMedicalAuPatient() {
    this.patientService.associerDossierMedicalAuPatient(this.patient.cin,this.dossierMedical)
      .subscribe(
        (nouveauDossier:DossierMedical) => {
          console.log('Dossier médical associé avec succès au patient:', nouveauDossier);
         
        },
        (error) => {
          console.error('Une erreur est survenue lors de l\'association du dossier médical au patient:', error);
        }
      );
  }

addRDV() {
  // Add RDV
  this.adminService.addRDV(this.rdv).subscribe(
    (addedRDV: RDV) => {
      console.log('RDV added successfully:', addedRDV);

      // Assign patient and medecin to RDV
      this.adminService.assignPatientAndMedecinTordv(this.rdv.nomDuPatient, this.rdv.nomDuMedecin, addedRDV).subscribe(
        () => {
          console.log('Association successful.');
         
        },
        (error) => {
          console.error('Error associating RDV with Patient:', error);
        }
      );
    },
    (error) => {
      console.error('Error adding RDV:', error);
    }
  );
}
onDelegationChange(): void {
  console.log('Selected Delegation:', this.rdv.nomDelegation);
  // You can add more logic if needed
}


updateRDV() {
  // Assuming you have an RDV object ready to be updated
  this.adminService.updateRDV(this.rdv).subscribe(
    (updatedRDV: RDV) => {
      console.log('RDV updated successfully:', updatedRDV);
    },
    (error) => {
      console.error('Error updating RDV:', error);
    }
  );
}

deleteRDV(idRDV: number) {
  this.adminService.deleteRDV(idRDV).subscribe(
    () => {
      console.log('RDV deleted successfully');
    },
    (error) => {
      console.error('Error deleting RDV:', error);
    }
  );
}
getAllRDVs() {
  this.adminService.getAllRDVs().subscribe(
    (rdvs: RDV[]) => {
      this.rdvs = rdvs;
    },
    (error: any) => {
      console.error('Error fetching RDVs:', error);
    }
  );
}
assignSpecialiteAndServiceToMedecin() {
  this.adminService.assignSpecialiteAndServiceToMedecin(this.specialiteId, this.serviceId, this.medecinId).subscribe(
    () => {
      console.log("Medecin:", this.medecin.idMedecin);
      console.log('Assigned Specialite and Service to Medecin successfully');
    },
    (error) => {
      console.error('Error assigning Specialite and Service to Medecin:', error);
    }
  );
}
assignPatientAndMedecinTordv()  :void{
  this.adminService.assignPatientAndMedecinTordv(this.patientId, this.medId, this.rdvId).subscribe(
    () => {
      console.log('Assigned Patient and Medic to RDV successfully');
    },
    (error) => {
      console.error('Error assigning:', error);
    }
  );
}
assignEtablissementToMedecin(): void {
  this.adminService.assignEtablissementToMedecin(this.etablissementId, this.medecinId).subscribe(
    () => {
      console.log('Assignation réussie');
      // Vous pouvez ajouter d'autres actions après la réussite de la requête
    },
    (error) => {
      console.error('Erreur lors de l\'assignation', error);
      // Vous pouvez gérer les erreurs ici
    }
  );
}
fillFormFields(rdv: RDV): void {
  this.rdv.nomDuPatient = rdv.nomDuPatient;
  this.rdv.nomDuMedecin = rdv.nomDuMedecin;
  this.rdv.dateRDV=rdv.dateRDV;
  this.rdv.heureRdv=rdv.heureRdv;
  this.rdv.idRDV=rdv.idRDV;
}
getEtatRDVClass(etatRDV: number): string {
  switch (etatRDV) {
    case 0:
      return 'status active';
    case 1:
      return 'status cancelled';
    case 2:
      return 'status instant';
    case 3:
      return 'status disabled';
    default:
      return '';
  }
}
getEtatRDVChoice(etatRDV: number): string {
  return 'choix' + etatRDV;
}

getTypeOfEtatRDV(): string {
  return typeof this.rdv.etatRDV;
}

pourcentageRDVPayes(): Observable<number> {
  return this.patientService.getPourcentageRDVPayes();
}
nombreRDVParEtat(etat:string):Observable<number>{
  return this.patientService.getNombreRDVByEtat(etat);
}
ngAfterViewInit(): void {
  this.createPieChart();
 
    this.createBarChart();

}
createPieChart(): void {

  
  this.pourcentageRDVPayes().subscribe((pourcentage: number) => { 
    // Création du pie chart
  const canvas: any = document.getElementById('pieChart');
  const context = canvas.getContext('2d');
    // Création du pie chart
    const pieChartCanvas: any = document.getElementById('pieChart');
    const pieChartContext = pieChartCanvas.getContext('2d');
    new Chart(pieChartContext, {
      type: 'pie',
      data: {
        labels: ['RDV Payés', 'non payés'],
        datasets: [
          {
            data: [pourcentage, 100 - pourcentage], // Complément pour atteindre 100%
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384']
          }
        ]
      }
    });
    });
    
}
createBarChart(): void {
  
  const barChartCanvas: any = document.getElementById('barChart');
  const barChartContext = barChartCanvas.getContext('2d');
  forkJoin([
    this.nombreRDVParEtat('ACCEPTER'),
    this.nombreRDVParEtat('ANNULER'),
    this.nombreRDVParEtat('ENINSTANT'),
    this.nombreRDVParEtat('MODIFIER')
  ]).subscribe(([acceptes, annules, enInstant, modifies]) => {
  new Chart(barChartContext, {
    type: 'bar',
    data: {
      labels: ['Accepté', 'Annulé', 'En Instant', 'Modifié'],
      datasets: [
        {
          label: 'Nombre de RDVs',
          data: [acceptes, annules, enInstant, modifies],
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
          borderColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
}

  getRDVPayes(): void {
    this.rdvService.getRDVPayes().subscribe(data => {
      this.rdvPayes = data;
    });
  }

  getRDVNonPayes(): void {
    this.rdvService.getRDVNonPayes().subscribe(data => {
      this.rdvNonPayes = data;
    });
  }
}