import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MaterialModule,RouterLink,RouterLinkActive,RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
 
  constructor(private router: Router) {}
  logout(){
    // localStorage.clear();
     //sessionStorage.clear();
     //this.router.navigate(['/login']);
    // alert('Logout Successfully');
    this.router.navigate(['/login']).then(() => {
      history.pushState(null, '', '/login');
      window.onpopstate = () => {
          history.pushState(null, '', '/login'); // back button not work
      };
    });
  }
}
