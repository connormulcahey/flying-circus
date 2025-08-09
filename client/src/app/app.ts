import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostsService, Post } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  posts = signal<Post[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private postsService: PostsService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Component initialized, fetching posts...');
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        console.log('Posts received:', posts);
        this.posts.set(posts);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        this.error.set('Failed to load posts');
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  formatContent(content: string): string[] {
    return content.split('\n\n');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
