import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostsService, Post } from './posts.service';
import { NavigationComponent } from './navigation.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
  standalone: true,
  imports: [NavigationComponent]
})
export class PostDetailComponent implements OnInit {
  post = signal<Post | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postsService: PostsService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      this.loadPost(postId);
    }
  }

  loadPost(id: number) {
    this.loading.set(true);
    this.postsService.getPost(id).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching post:', error);
        this.error.set('Failed to load post');
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  navigateHome() {
    this.router.navigate(['/']);
  }
}