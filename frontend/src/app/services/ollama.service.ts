import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OllamaService {
  private apiUrl = 'http://localhost:3000/chat';

  constructor(private http: HttpClient) {}

  generateResponse(prompt: string, model: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { "prompt": prompt, "model": model });
  }
}
