import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChatMessage } from "../../../types"

@Component({
    selector: 'app-collapsible-chat-widget',
    templateUrl: './collapsible-chat-widget.component.html',
    styleUrls: ['./collapsible-chat-widget.component.scss']
})
export class CollapsibleChatWidgetComponent implements OnInit {
    @Input() chatHistory: ChatMessage[] = [];
    @Input() isLoading: boolean = false;
    @Input() chatError: string | null = null;
    @Output() messageSent = new EventEmitter<string>();

    isExpanded: boolean = false;
    // To show a notification dot if new messages arrive while collapsed (optional enhancement)
    // hasUnreadMessages: boolean = false;

    constructor() { }

    ngOnInit(): void {
        // Potentially auto-expand on first load or if there's an error
        // if (this.chatError) {
        //   this.isExpanded = true;
        // }
    }

    toggleChat(): void {
        this.isExpanded = !this.isExpanded;
        // if (this.isExpanded) {
        //   this.hasUnreadMessages = false; // Clear notification when opened
        // }
    }

    handleMessageSent(message: string): void {
        this.messageSent.emit(message);
        // If you want to auto-expand on sending a message (if it was collapsed)
        // if (!this.isExpanded) {
        //   this.isExpanded = true;
        // }
    }
}