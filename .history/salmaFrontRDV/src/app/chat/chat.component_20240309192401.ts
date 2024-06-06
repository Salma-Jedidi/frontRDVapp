import { Component, ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent  {
  @ViewChild('messageArea', { static: true }) messageArea!: ElementRef; 
  userQuery: string = '';
  selectedQuestion: string = ''; // Add this property for the <select>
  messages: Array<{ type: 'user' | 'bot', content: string, time: string }> = [];

  constructor(private chatbotService: ChatbotService, private renderer: Renderer2) {}
 
  sendMessage() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const strTime = `${hour}:${minute}`;
    const rawText = this.selectedQuestion || this.userQuery; // Use selectedQuestion if available

    // Add user message to the messages array
    this.messages.push({ type: 'user', content: rawText, time: strTime });

    this.userQuery = '';
    this.selectedQuestion = ''; // Reset selectedQuestion

    // Send user message to the server
    this.chatbotService.sendMessage(rawText).subscribe(
      (data) => {
        // Add bot message to the messages array
        this.messages.push({ type: 'bot', content: data.response, time: strTime });
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }
  
  predefinedQuestions = [
    {"user": "Quels sont vos horaires d'ouverture?"},
    {"user": "Comment puis-je prendre rendez-vous?"},
    {"user": "Quels services proposez-vous?"},
    {"user": "Avez-vous des consultations en ligne?"},
    {"user": "Quel est le coût d'une consultation?"},
    {"user": "Avez-vous des rendez-vous d'urgence?"},
    {"user": "Quelles sont les mesures de sécurité COVID-19 que vous avez mises en place?"},
    {"user": "Quels types d'assurances acceptez-vous?"},
    {"user": "Pouvez-vous me rappeler mon rendez-vous?"},
    {"user": "Comment puis-je annuler un rendez-vous?"},
    {"user": "Avez-vous des promotions en ce moment?"},
    {"user": "Quels sont les spécialistes disponibles aujourd'hui?"},
    {"user": "Quels documents dois-je apporter à mon rendez-vous?"},
    {"user": "Pouvez-vous m'envoyer une confirmation de mon rendez-vous par e-mail?"},
    {"user": "Quelle est votre politique d'annulation?"},
    {"user": "Pouvez-vous me donner des conseils pour ma santé?"},
    {"user": "Comment puis-je obtenir mes résultats de test?"},
    {"user": "Quels sont les types de tests que vous proposez?"}
  ];
}