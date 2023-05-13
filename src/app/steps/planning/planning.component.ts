import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent implements OnInit {
  activeItemIndex = 0;

  highestIndex = 0

  constructor(
    public dataService: DataService, private router: Router,
  ) { }

  changeIndex(newIndex: number) {
    if (newIndex > this.highestIndex) {
      this.highestIndex = newIndex
    }
    this.activeItemIndex = newIndex
  }

  ngOnInit(): void {
    if (!this.dataService.currentPeriod) {
      this.router.navigate(['/steps/upload'])
    }
  }

  back = () => this.router.navigate([`/steps/selldirect`]);

  next = () => {
    // if(this.dataService.currentPeriod)
    // this.dataService.updatePeriod(this.dataService.currentPeriod);

    //if()
    this.router.navigate(['/steps/production']);
  }
}



