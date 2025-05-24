
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // For future Python backend calls

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PortfolioInputFormComponent } from './components/portfolio-input-form/portfolio-input-form.component';
import { InsightDisplayComponent } from './components/insight-display/insight-display.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ChatComponent } from './components/chat/chat.component';
import { CollapsibleChatWidgetComponent } from './components/collapsible-chat-widget/collapsible-chat-widget.component';

import { GeminiService } from './services/gemini.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PortfolioInputFormComponent,
    InsightDisplayComponent,
    LoadingSpinnerComponent,
    ChatComponent, // Add ChatComponent to declarations,
    CollapsibleChatWidgetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // For template-driven forms
    ReactiveFormsModule, // For reactive forms
    HttpClientModule // For making HTTP requests (e.g., to Python backend later)
  ],
  providers: [GeminiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
