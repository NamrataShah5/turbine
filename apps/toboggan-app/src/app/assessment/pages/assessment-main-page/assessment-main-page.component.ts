import { AfterContentInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'toboggan-ws-assessment-main-page',
  templateUrl: './assessment-main-page.component.html',
  styleUrls: ['./assessment-main-page.component.scss'],
})
export class AssessmentMainPageComponent implements AfterContentInit{
  public allPendingListCount!: number;
  public myPendingListCount!: number;
  constructor(
    private router: Router,
    private assessmentService: AssessmentService
  ) { 
  }

  navigateToEvaluated() {
    this.router.navigate([`/assessment/evaluated`]);
  }

  ngAfterContentInit() {
    this.assessmentService.allPendingListCount.subscribe(
      data => {
        this.allPendingListCount = data;});

    this.assessmentService.myPendingListCount.subscribe(
      data => { this.myPendingListCount = data;});  
  }
}