import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private ollamaApiUrl = 'http://localhost:8000/chat';
  private llamaApiUrl = 'http://localhost:8000/related-documents'; // Change if needed

  constructor(private http: HttpClient) {}

  // Function for OllamaService
  generateResponse(prompt: string, model: string, user_id: string): Observable<any> {
    return this.http.post<any>(this.ollamaApiUrl, { prompt, model, user_id });
  }

  // Function for LlamaService
  queryLlama(model: string, query: string, collectionId: string, topK: number, userId: string): Observable<any> {
    const requestBody = {
      model: model,
      query: query,
      collection_id: collectionId,
      top_k: topK,
      user_id: userId
    };
    return this.http.post<any>(this.llamaApiUrl, requestBody);
  }
}
