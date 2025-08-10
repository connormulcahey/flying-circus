import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about-content">
      <h2>About</h2>
      <p>
        <a href="mailto:coachst@gmail.com">coachst@gmail.com</a><br><br>
        3 Warwick Center Dr & Hoyt Rd<br>
        Warwick, New York 10990<br><br>
        <a href="https://maps.google.com/?q=3+Warwick+Center+Dr+%26+Hoyt+Rd,+Warwick,+New+York+10990" target="_blank" rel="noopener noreferrer">Get Directions →</a><br><br>
        <a href="https://www.facebook.com/hvflyingcircus" target="_blank" rel="noopener noreferrer">Facebook Page →</a>
      </p>
      
      <h2>ESSX RENTAL PROGRAM</h2>
      <p><a href="https://circuspolevault.com/" target="_blank" rel="noopener noreferrer">Visit our equipment rental program</a> for professional pole vaulting equipment rentals.</p>
      
      <h2>FLYING CIRCUS ANNUAL CLUB MEMBERSHIP</h2>
      <p>
        for our 2025-26 Season (Sept.1, 2025--Sept 1, 2026)<br>
        MANDATORY for all Programs<br>
        <a href="https://form.jotform.com/251964592146162" target="_blank" rel="noopener noreferrer">Register Here</a>
      </p>
    </div>
  `,
  styles: [`
    .about-content {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      color: #6203a3;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 1rem;
      margin: 1rem 0 0.5rem 0;
    }

    a {
      color: #6203a3;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    p {
      line-height: 1.6;
      margin-bottom: 1rem;
    }
  `]
})
export class AboutComponent {}