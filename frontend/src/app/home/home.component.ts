import { Component, HostListener } from '@angular/core';
import { LoremIpsumService } from "../../services/loremIpsum/loremIpsum.service";
import { ShufflerService } from "../../services/shuffler/shuffler.service";
import { UserDataService } from "../../services/userData/userData.service";
import { IUserData } from "../../models/IUserData";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public userAvatarUrl = '';
  public isLoremIpsumLoaded = false;
  public trackedAvatarId = 'userAvatar';
  public loremIpsum: string[] = [];

  private wasAvatarSeen = false;

  public constructor(
    private readonly $loremIpsum: LoremIpsumService,
    private readonly $shuffler: ShufflerService,
    private readonly $userData: UserDataService,
  ) {}


  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    if (this.wasAvatarSeen) {
      return;
    }
    const targetElement = document.getElementById(this.trackedAvatarId);
    if (targetElement) {
      const targetElementPosition = targetElement.getBoundingClientRect();

      if (targetElementPosition.top <= window.innerHeight && targetElementPosition.bottom >= 0) {
        this.wasAvatarSeen = true;
        this.$userData.setAvatarSeen().subscribe(() => {
          console.log('Avatar seen - logged');
        });
        console.log('Avatar is visible');
      }
    }
  }
  public async ngOnInit(): Promise<void> {
    this.$userData.getUserData().subscribe((userData: IUserData) => {
      console.log(userData);
      this.userAvatarUrl = userData.avatarUrl;
      this.wasAvatarSeen = userData.isAvatarSeen;
      this.$loremIpsum.getLoremIpsum(20).subscribe((data: string[]) => {
        this.loremIpsum = data;
        this.isLoremIpsumLoaded = true;
      });
    })

  }

  public getShuffledLoremIpsum(seed: number): string[] {
    return this.$shuffler.shuffleSeed(this.loremIpsum, `seed#${seed}`);
  }
}
