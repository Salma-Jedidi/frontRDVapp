import { Component, OnInit, Renderer2, ElementRef, TemplateRef, ViewChild } from '@angular/core';

import { User } from '../models/User';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { NgIfContext } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('userNotFoundSection') userNotFound: TemplateRef<NgIfContext<boolean>> | undefined;
 
  user: User = {
    id: 0,
    nom: '',
    email: '',
    password: '',
    role: '',
    dateCreation: undefined
  };

  users: User[] = [];
searchUserId: any;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.setupEventListeners();
    this.getAllUsers();
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

  addUser() {
    this.adminService.addUser(this.user).subscribe(
      (addedUser: User) => {
        console.log('User added successfully:', addedUser);
        
      },
      (error) => {
        console.error('Error adding user:', error);
      
      }
    );
  }

  updateUser() {
    this.adminService.updateUser(this.user).subscribe(
      (updatedUser: User) => {
        console.log('User updated successfully:', updatedUser);
     
      },
      (error) => {
        console.error('Error updating user:', error);
        
      }
    );
  }

  deleteUser(  userId:number) {
    this.adminService.deleteUser(userId).subscribe(
      () => {
        console.log('User deleted successfully');
        
      },
      (error) => {
        console.error('Error deleting user:', error);
        
      }
    );
  }
  
 

  affichUser(idUser: number) {
    console.log('Search User ID:', idUser);
    this.adminService.affichUser(idUser).subscribe(
      (response: User) => {
        this.users = [response]; // Mettez la réponse dans un tableau
      },
      (error: any) => {
        this.users = [];
        console.error('Error fetching user details:', error);
      }
    );
  }
  
  

  getAllUsers() {
    this.adminService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
}
}