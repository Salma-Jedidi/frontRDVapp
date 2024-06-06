import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  showAccueil: boolean = false;
  errorMessage: string | null = null;
  selectedFile: File | null = null;
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string | undefined;
  public videoOptions: MediaTrackConstraints = {
  // width: {ideal: 1024},
  // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
// webcam snapshot trigger
private trigger: Subject<void> = new Subject<void>();
// switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  user: User = {
    id: 0,
    nom: '',
    email: '',
    password: '',
    role: '',
    dateCreation: undefined
  };

  constructor(private authService: AuthentificationService, private router: Router,private http: HttpClient) {}

  ngOnInit() {}

/*   signup(): void {
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
  } */


/*   login(loginForm: NgForm): void {
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
 */
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

  

  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }



  login(loginForm: any) {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('email', this.user.email);

      this.http.post('http://127.0.0.1:5000/login', formData).subscribe(
        response => {
          console.log('Login success', response);
        },
        error => {
          console.error('Login error', error);
        }
      );
    } else {
      // Handle login with email and password
      const loginData = {
        email: this.user.email,
        password: this.user.password
      };

      this.http.post('http://127.0.0.1:5000/login', loginData).subscribe(
        response => {
          console.log('Login success', response);
        },
        error => {
          console.error('Login error', error);
        }
      );
    }
  }

  signup() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('name', this.user.nom);
      formData.append('email', this.user.email);
      formData.append('password', this.user.password);
      formData.append('role', this.user.role);

      this.http.post('http://127.0.0.1:5000/register', formData).subscribe(
        response => {
          console.log('Signup success', response);
        },
        error => {
          console.error('Signup error', error);
        }
      );
    } else {
      console.error('No file selected for signup');
    }
  }
  
}