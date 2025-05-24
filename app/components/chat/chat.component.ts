import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatMessage } from '../../../types';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
    @Input() chatHistory: ChatMessage[] = [];
    @Input() isLoading: boolean = false;
    @Input() chatError: string | null = null;
    @Output() messageSent = new EventEmitter<string>();

    @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;

    userInput: string = '';

    constructor() { }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    sendMessage(): void {
        if (this.userInput.trim() && !this.isLoading) {
            this.messageSent.emit(this.userInput.trim());
            this.userInput = '';
        }
    }

    private scrollToBottom(): void {
        try {
            if (this.chatMessagesContainer) {
                this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
            }
        } catch (err) {
            console.error("Could not scroll to bottom:", err);
        }
    }
}
