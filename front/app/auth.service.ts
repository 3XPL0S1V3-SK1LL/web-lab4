import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private router: Router) {}

 
  login(username: string): void {
    sessionStorage.setItem('activeUser', username);  
    this.router.navigate(['/main-page']);  
  }


  logout(): void {
    sessionStorage.removeItem('activeUser');
    this.router.navigate(['/start-page']);
  }



  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('activeUser');  
  }


  getUsername(): string | null {
    return sessionStorage.getItem('activeUser'); 
  }
}
