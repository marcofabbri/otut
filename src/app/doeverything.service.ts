import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

const USERS_URL = 'https://reqres.in/api/users';

@Injectable({
  providedIn: 'root'
})
export class DoeverythingService {

  constructor(private httpClient: HttpClient) { }

  public fakeHttp0(val: any, d: number): Observable<any> {
    return of(val).pipe(delay(d));
  }

  public fakeHttp(val: any, d: number): Observable<any> {
    return interval(d).pipe(map(index => `${val} - ${index}`));
  }

  public realHttp(): Observable<Array<any>> {
    return this.httpClient.get<Array<any>>(USERS_URL)
      .pipe(catchError(this.handleError('realHttp', 'Errore nel recupero degli utenti', null)));
  }

  private handleError<T>(operation = 'operation', message?: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} error`, error);
      if (message) {
        console.error(`Error ${message}`);
      }
      return throwError(message);
    };
  }
}
