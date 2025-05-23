
import { Component } from '@angular/core';
import { APP_TITLE } from '../../../constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  appTitle = APP_TITLE;
}
