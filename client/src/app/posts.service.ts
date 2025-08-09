import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = 'http://localhost:5025/api/posts'; // Update this to match your API URL

  constructor(private http: HttpClient) { }

  getPosts(page: number = 1, pageSize: number = 5): Observable<PagedResult<Post>> {
    return this.http.get<PagedResult<Post>>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }
}