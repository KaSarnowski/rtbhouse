import { Component } from '@angular/core';
import { UserDataService } from "../../services/userData/userData.service";
import { IUserStats } from "../../models/IUserStats";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {
  public userStats: IUserStats | null = null;
  constructor(
    private readonly $userData: UserDataService,
    ) {
  }

  public ngOnInit(): void {
    this.$userData.getUserStats().subscribe((stats: IUserStats) => {
      this.userStats = stats;
    });
  }

}
