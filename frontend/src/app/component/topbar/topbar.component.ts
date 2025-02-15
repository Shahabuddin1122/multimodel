import {Component, EventEmitter, Output} from '@angular/core';
@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Output() selectionChanged = new EventEmitter<string>();

  onSelectionChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectionChanged.emit(selectedValue); // Emit the selected value
  }
}
