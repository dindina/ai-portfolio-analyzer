
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { PortfolioItem } from '../../../types';

@Component({
  selector: 'app-portfolio-input-form',
  templateUrl: './portfolio-input-form.component.html',
  styleUrls: ['./portfolio-input-form.component.css']
})
export class PortfolioInputFormComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Output() portfolioSubmit = new EventEmitter<PortfolioItem[]>();

  portfolioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.portfolioForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Add some default items for demonstration
    this.addDefaultItems();
  }

  get items(): FormArray {
    return this.portfolioForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      id: [Date.now().toString() + Math.random().toString(36).substring(2)],
      symbol: ['', Validators.required],
      allocation: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addDefaultItems() {
    // Added 'name' to default items
    const defaultPortfolio: Omit<PortfolioItem, 'id'>[] = [ // Use Omit for id as it's generated
      { name: 'NVIDIA Corp.', symbol: 'NVDA', allocation: 35 },
      { name: 'Alphabet Inc. (Class A)', symbol: 'GOOGL', allocation: 35 },
      { name: 'Amazon.com Inc.', symbol: 'AMZN', allocation: 30 },

    ];
    defaultPortfolio.forEach(item => {
      this.items.push(this.fb.group({
        id: [Date.now().toString() + Math.random().toString(36).substring(2)], // Generate ID here
        name: [item.name, Validators.required],
        symbol: [item.symbol, Validators.required],
        allocation: [item.allocation, [Validators.required, Validators.min(0), Validators.max(100)]]
      }));
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
    this.portfolioForm.updateValueAndValidity();
    this.logFormStatus('addItem');
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.portfolioForm.updateValueAndValidity();
    this.logFormStatus('removeItem');
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      this.portfolioSubmit.emit(this.portfolioForm.value.items as PortfolioItem[]);
    } else {
      // Mark fields as touched to show validation errors
      this.portfolioForm.markAllAsTouched();
      console.error("Form is invalid", this.portfolioForm.value);
    }
  }

  get totalAllocation(): number {
    return this.items.controls.reduce((sum, control) => {
      const allocation = control.get('allocation')?.value || 0;
      return sum + parseFloat(allocation);
    }, 0);
  }
  logFormStatus(context: string): void {
    console.log(`--- Form Status (${context}) ---`);
    console.log('portfolioForm.valid:', this.portfolioForm.valid);
    console.log('portfolioForm.errors:', this.portfolioForm.errors);
    console.log('portfolioForm.status:', this.portfolioForm.status);

    console.log('items FormArray valid:', this.items.valid);
    console.log('items FormArray errors:', this.items.errors);
    console.log('items FormArray status:', this.items.status);

    this.items.controls.forEach((control: AbstractControl, index: number) => {
      const group = control as FormGroup;
      console.log(`Item ${index} FormGroup valid:`, group.valid);
      console.log(`Item ${index} FormGroup errors:`, group.errors);
      console.log(`Item ${index} FormGroup status:`, group.status);
      if (group.get('symbol')) {
        console.log(`  Symbol (${group.get('symbol')?.value}) valid:`, group.get('symbol')?.valid);
        console.log(`  Symbol errors:`, group.get('symbol')?.errors);
      }
      if (group.get('allocation')) {
        console.log(`  Allocation (${group.get('allocation')?.value}) valid:`, group.get('allocation')?.valid);
        console.log(`  Allocation errors:`, group.get('allocation')?.errors);
      }
    });
    console.log('--------------------------');
  }
}
