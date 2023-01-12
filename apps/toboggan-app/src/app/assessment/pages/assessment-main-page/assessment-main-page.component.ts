import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'toboggan-ws-assessment-main-page',
  templateUrl: './assessment-main-page.component.html',
  styleUrls: ['./assessment-main-page.component.scss'],
})
export class AssessmentMainPageComponent {
  constructor(
    private router: Router
  ) { }
  navigateToEvaluated() {
    this.router.navigate([`/assessment/evaluated`]);
  }
}
