import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  showAccueil: boolean = false;
  errorMessage: string | null = null;

  user: User = {
    id: 0,
    nom: '',
    email: '',
    password: '',
    role: '',
    dateCreation: undefined
  };

  constructor(private authService: AuthentificationService, private router: Router) {}

  ngOnInit() {}

  signup(): void {
    this.errorMessage = null;

    this.authService.emailExists(this.user.email).subscribe(emailExists => {
      if (emailExists) {
        this.errorMessage = 'Email already exists';
        alert(this.errorMessage);  // Alert box for email already exists
        return;
      }

      this.authService.isPasswordValid(this.user.password).subscribe(isValid => {
        if (!isValid) {
          this.errorMessage = 'Password must be at least 6 characters long';
          alert(this.errorMessage);  // Alert box for invalid password
          return;
        }

        const newUser: User = {
          id: 0,
          nom: this.user.nom,
          email: this.user.email,
          password: this.user.password,
          role: this.user.role,
          dateCreation: this.user.dateCreation
        };

        this.authService.signup(newUser).subscribe(
          (response) => {
            console.log('Signup successful', response);
            // Handle successful signup response if needed
          },
          (error) => {
            console.error('Signup error:', error);
            this.errorMessage = 'An error occurred during signup';
          }
        );
      });
    });
  }


  login(loginForm: NgForm): void {
    console.log('User object:', this.user);
    if (!this.user.email || !this.user.password) {
      console.error('Email and password are required for login.');
      return;
    }

    const credentials = {
      id: this.user.id,
      nom: this.user.nom,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role,
      dateCreation: this.user.dateCreation

    };

    this.authService.signin(credentials).subscribe(
      (response) => {
        console.log('Login successful:', response);

        // Extract role from the response
        const userRole = response?.role;
        
        console.log('User role:', userRole);

        if (!userRole) {
          this.errorMessage = 'Role information missing';
          return;
        }

        console.log('User role:', userRole);

        switch (userRole.trim().toUpperCase()) {
          case 'PATIENT': 
            console.log('Redirecting to /accueil for PATIENT');
            this.router.navigate(['/patient']);
            break;
          case 'MEDECIN': 
            console.log('Redirecting to /accueil for MEDECIN');
            this.router.navigate(['/medecin']);
            break;
            case 'SECRETAIRE': 
            console.log('Redirecting to /accueil for MEDECIN');
            this.router.navigate(['/secretaire']);
            break;
          case 'ADMIN':
            console.log('Redirecting to /adminBoard for ADMIN');
            this.router.navigate(['/adminBoard']);
            break;
          default:
            console.error('Unknown role:', userRole);
            this.errorMessage = 'Invalid role';
            break;
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid email or password';
      }
    );

    loginForm.resetForm();
  }

  showAccueilComponent(): void {
    this.showAccueil = true;
  }
  onSubmit() {
    this.authService.forgotPassword(this.user.email).subscribe(
      () => {
        console.log('Email de récupération de mot de passe envoyé avec succès.');
      },
      error => {
        console.error('Une erreur s\'est produite lors de l\'envoi de l\'email de récupération de mot de passe :', error);
      }
    );
  }

}