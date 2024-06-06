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
  replyContent: string = ''; // Contenu de la réponse
  replyMessageId: number = 0;
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
          this.messages = messages.map(message => ({
            ...message,
            showCommentSection: false 
          }));
          console.log(this.messages);
        }, 
        (error: any) => {
          console.error('Error fetching messages:', error);
        }
      );
}

toggleCommentSection(message: MessagePatient): void {
  this.replyMessageId = message.idMessage;
  console.log('Style de display avant:', this.commentSection.nativeElement.style.display); // Vérifiez la valeur actuelle
  if (this.commentSection.nativeElement.style.display === none') {
    this.commentSection.nativeElement.style.display = 'block';
  } else {
    this.commentSection.nativeElement.style.display = 'none';
  }
  console.log('Style de display après:', this.commentSection.nativeElement.style.display); // Vérifiez la valeur mise à jour
}


  replyToMessage(message: MessagePatient): void {
    // Construire l'objet de réponse avec le contenu et l'ID du message
    const replyMessage: MessagePatient = {
      idMessage: this.replyMessageId,
      nomPatientMessage: message.nomPatientMessage, // ou toute autre information nécessaire
      email: message.email,
      contenueMessage: this.replyContent, // Contenu de la réponse
      reponseMessage: '',
      dateEnvoieMessage: '',
      dateEnvoiReponse: '',
      nomRepondMessage: ''
    };
    // Envoyer la réponse au service
    this.patientService.replyToMessage(replyMessage)
      .subscribe((reponseMessage: MessagePatient) => {
        console.log('Message replied successfully:', reponseMessage);
        // Réinitialiser le contenu de la réponse après l'envoi
        this.replyContent = '';
        // Vous pouvez également recharger la liste des messages si nécessaire
      }, error => {
        console.error('Erreur lors de la réponse au message:', error);
        // Vous pouvez gérer les erreurs ici
      });
  }

  cancelReply(): void {
    // Réinitialiser le contenu de la réponse et l'ID du message auquel répondre
    this.replyContent = '';
    this.replyMessageId = 0;
  }


}