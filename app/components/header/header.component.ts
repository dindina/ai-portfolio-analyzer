
import { Component } from '@angular/core';
import { APP_TITLE } from '../../../constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  appTitle = APP_TITLE;
}
