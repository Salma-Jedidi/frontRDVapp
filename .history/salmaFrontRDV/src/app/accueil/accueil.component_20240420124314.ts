import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { MessagePatient } from '../models/MessagePatient';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})

export class AccueilComponent implements OnInit {
  messagePatient:MessagePatient={
    idMessage:0,
    nomPatientMessage:'',
    contenueMessage:'',
    reponseMessage:'',
    dateEnvoieMessage:undefined,
    dateEnvoiReponse:undefined,
    email:''
  }
  messages: MessagePatient[]=[];
  @ViewChild('commentSection') commentSection!: ElementRef;
  constructor(private patientService: PatientService) { }
  @Input() scheduleType: string = '';
  @Input() iconClass: string = '';
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() timeSlots: string[] = [];


 
  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.patientService.getAllMessages()
      .subscribe(
        (messages:MessagePatient[]) => {
        this.messages = messages;
        console.log(this.messages);}, 
        (error: any) => {
          console.error('Error fetching messages:', error);
        }
      );
  }
  replyToMessage(messagePatient: MessagePatient): void {
    this.patientService.replyToMessage(messagePatient)
      .subscribe((reponseMessage: MessagePatient) => {
        console.log('Message replied successfully:', reponseMessage);
        // Vous pouvez faire quelque chose avec la réponse si nécessaire
      }, error => {
        console.error('Erreur lors de la réponse au message:', error);
     
      });
  }
  
  toggleCommentSection() {
      if (this.commentSection.nativeElement.style.display === 'none') {
          this.commentSection.nativeElement.style.display = 'block';
      } else {
          this.commentSection.nativeElement.style.display = 'none';
      }
  }
}


