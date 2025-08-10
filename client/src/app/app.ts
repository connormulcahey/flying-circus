import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostsService, Post, PagedResult } from './posts.service';
import { NavigationComponent } from './navigation.component';
import { AboutComponent } from './about.component';
import { StaffComponent } from './staff.component';

@Component({
  selector: 'app-main',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [RouterLink, NavigationComponent, AboutComponent, StaffComponent]
})
export class App implements OnInit {
  posts = signal<Post[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);
  hasNextPage = signal<boolean>(false);
  hasPreviousPage = signal<boolean>(false);
  currentView = signal<string>('posts');

  constructor(
    private postsService: PostsService, 
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // Check if mobile view, set default to about
    if (this.isMobileView()) {
      this.currentView.set('about');
    } else {
      this.loadPosts(1);
    }
  }

  isMobileView(): boolean {
    return window.innerWidth <= 600;
  }

  loadPosts(page: number) {
    console.log('Loading posts for page:', page);
    this.loading.set(true);
    this.postsService.getPosts(page, 5).subscribe({
      next: (result: PagedResult<Post>) => {
        console.log('Posts received:', result);
        this.posts.set(result.data);
        this.currentPage.set(result.page);
        this.totalPages.set(result.totalPages);
        this.totalCount.set(result.totalCount);
        this.hasNextPage.set(result.hasNextPage);
        this.hasPreviousPage.set(result.hasPreviousPage);
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

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.loadPosts(page);
    }
  }

  previousPage() {
    if (this.hasPreviousPage()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  navigateTo(view: string) {
    this.currentView.set(view);
    if (view === 'posts' && this.posts().length === 0) {
      this.loadPosts(1);
    }
    // Reset scroll to top when switching tabs
    window.scrollTo(0, 0);
    // Reset sidebar scroll to top
    const sidebar = document.querySelector('.blog-sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.scrollTop = 0;
    }
  }

  getPageNumbers(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];
    
    if (total <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({length: total}, (_, i) => i + 1);
    }
    
    // Always show first page
    pages.push(1);
    
    if (current <= 4) {
      // Near beginning: 1 2 3 4 5 ... total
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      if (total > 6) pages.push(-1); // -1 represents ellipsis
      pages.push(total);
    } else if (current >= total - 3) {
      // Near end: 1 ... total-4 total-3 total-2 total-1 total
      if (total > 6) pages.push(-1);
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Middle: 1 ... current-1 current current+1 ... total
      pages.push(-1);
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push(-1);
      pages.push(total);
    }
    
    return pages;
  }

  formatContent(content: string): string[] {
    return content.split('\n\n');
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
}
