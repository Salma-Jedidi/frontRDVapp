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
      nomDelegation:''
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
    
  constructor(private patientService: PatientService,private adminService:AdminService) { }
  ngOnInit(): void {
    this.adminService.getAllDelegations().subscribe(delegations => this.delegations = delegations);
    this.adminService.getAllSpecialite().subscribe(specialites => this.specialites =specialites);
    this.adminService.getAllServiceMedicales().subscribe(services=>this.services=services);
    this.getAllRDVs();
    this.getAllPatients();
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
        (nouveau) => {
          console.log('Dossier médical associé avec succès au patient:', response);
         
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

pourcentageRDVPayes(): number {
  // Logique pour calculer le pourcentage ici
  // Exemple : si 75% des rendez-vous sont payés, retournez 75
  return 75;
}

ngAfterViewInit(): void {

  // Création du pie chart
  const canvas: any = document.getElementById('pieChart');
  const context = canvas.getContext('2d');
  const pourcentage = this.pourcentageRDVPayes();

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

    // Création du bar chart
    const barChartCanvas: any = document.getElementById('barChart');
    const barChartContext = barChartCanvas.getContext('2d');

    new Chart(barChartContext, {
      type: 'bar',
      data: {
        labels: ['Accepté', 'Annulé', 'En Instant', 'Modifié'],
        datasets: [
          {
            label: 'Nombre de RDVs',
            data: [50, 10, 20, 10],
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
  }


}