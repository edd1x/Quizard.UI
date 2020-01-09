import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})

export class QuestionService {

questionUrl: string = environment.api + "/api/questions";

constructor(private http: HttpClient) { }

checkAuth(creditentials: string) : Observable<any> {
  return this.http.post(this.questionUrl, creditentials, httpOptions);
}

}
