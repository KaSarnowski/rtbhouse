import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { StatsComponent } from "./stats/stats.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'stats', component: StatsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
   ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
