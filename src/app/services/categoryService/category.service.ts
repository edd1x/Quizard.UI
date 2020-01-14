import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

url: string = environment.api + '/api/Categories';

constructor(private http: HttpClient) { }

public getAll() {
  return this.http.get(this.url);
  }
public postCategory(categoryName : string) {
    return this.http.post(this.url,categoryName, httpOptions);
  }
}


