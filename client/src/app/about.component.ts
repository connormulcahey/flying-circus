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

      <h2>Bullitens</h2>
      
      <div class="bulletins-box">
        <h3>ESSX RENTAL PROGRAM</h3>
        <p><a href="https://circuspolevault.com/" target="_blank" rel="noopener noreferrer">Visit our equipment rental program</a> for professional pole vaulting equipment rentals.</p>
      </div>
      
      <div class="bulletins-box">
        <h3>FLYING CIRCUS ANNUAL CLUB MEMBERSHIP</h3>
        <p>
          for our 2025-26 Season (Sept.1, 2025--Sept 1, 2026)<br>
          MANDATORY for all Programs<br>
          <a href="https://form.jotform.com/251964592146162" target="_blank" rel="noopener noreferrer">Register Here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .about-content {
      width: 100%;
    }

    h2 {
      color: #6203a3;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 1rem;
      margin: 1rem 0 0.5rem 0;
    }

    h3 {
      color: #666;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 0.9rem;
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

    .bulletins-box {
      background: white;
      border: 1px solid #ddd;
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 4px;
      box-sizing: border-box;
    }

    @media (max-width: 600px) {
      .about-content {
        width: 80%;
        margin: 0 auto;
        padding: 0;
      }

      .bulletins-box {
        width: 100%;
        margin: 1rem 0;
        padding: 0.8rem;
        overflow-wrap: break-word;
        word-wrap: break-word;
        box-sizing: border-box;
      }

      h2, h3 {
        word-wrap: break-word;
      }

      p {
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
    }
  `]
})
export class AboutComponent {}