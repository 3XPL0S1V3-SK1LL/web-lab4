import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'http://localhost:42610/lab4-back-1.0-SNAPSHOT/api'; 

  constructor() {}

checkUser(login: string): Observable<boolean> {
  return new Observable(observer => {
    fetch(`${this.apiUrl}/user/check-login/${encodeURIComponent(login)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        if (response.ok) {
          observer.next(true); 
        } else if (response.status === 404) {
          observer.next(false); 
        } else {
          observer.error(`Unexpected status: ${response.status}`);
        }
        observer.complete();
      })
      .catch(error => {
        observer.error(error); 
      });
  });
}
  

  checkPassword(login: string, password: string): Observable<any> {
    return new Observable(observer => {
      fetch(`${this.apiUrl}/user/check-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      })
      .then(response => {
        if (response.status === 200) {
          console.log("200")
          observer.next({ success: true });
        } else if (response.status === 403) {
          console.log("403");
          observer.next({ success: false, message: 'User is already logged in' }); 
        } else if (response.status === 404) {
          console.log("404");
          observer.next({ success: false, message: 'User not found' });
        }else if (response.status === 409) {
          console.log("404");
          observer.next({ success: false, message: 'Incorrect password' });
        } else {
          observer.error(`Unexpected status: ${response.status}`);
        }
        observer.complete();
      })
      .catch(error => {
        observer.error(error);
      });
    });
  }
  
  addUser(login: string, password: string): Observable<any> {
    return new Observable(observer => {
      fetch(`${this.apiUrl}/user/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      })
        .then(response => {
          if (response.status === 200) {
            observer.next({ success: true }); 
          } else if (response.status === 404) {
            observer.next({ success: false, message: 'User already exists' }); 
          } else {
            observer.error(`Unexpected status: ${response.status}`); 
          }
          observer.complete();
        })
        .catch(error => {
          observer.error(error); 
        });
    });
  }
  
  addPoint(pointData: { x: string; y: string; r: string }): Observable<any> {
    return new Observable(observer => {
      fetch(`${this.apiUrl}/point/add-point`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pointData),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to add point');
          }
        })
        .then(data => observer.next(data))
        .catch(error => observer.error(error));
    });
  }

  getUserPoints(owner: string): Observable<any> {
  return new Observable(observer => {
    fetch(`${this.apiUrl}/point/get-points/${owner}`)
      .then((response) => response.json())
      .then((data) => observer.next(data))
      .catch((error) => {
        console.error('Error fetching user points:', error);
        observer.error(error);
      });
  });
 }
 logout(login: string): Observable<any> {
  return new Observable(observer => {
    fetch(`${this.apiUrl}/user/logout/${encodeURIComponent(login)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (response.ok) {
        observer.next({ success: true });
      } else {
        observer.error(`Unexpected status: ${response.status}`);
      }
      observer.complete();
    })
    .catch(error => {
      observer.error(error);
    });
  });
}
sendHeartBeat(username: string): Observable<any> {
  return new Observable(observer => {
    fetch(`${this.apiUrl}/user/heart-beat/${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        if (response.ok) {
          observer.next(true); 
        } else {
          observer.error(`Unexpected status: ${response.status}`);
        }
        observer.complete();
      })
      .catch(error => {
        observer.error(error); 
      });
  });
}
}