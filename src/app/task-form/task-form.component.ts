import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CoreService } from '../core/core.service';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, 
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit{

  taskForm : FormGroup

  constructor(private _fb : FormBuilder, 
    private _apiService: ApiService, 
    private _dialogRef: MatDialogRef<TaskFormComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.taskForm = this._fb.group({
      title: '',
      description: '',
      date: '',
      time: '',
      timeDuration: '',
    })
  }

  ngOnInit(): void {
    this.taskForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.data){
      if (this.taskForm.valid) {
        this._apiService.updateTask(this.data.id, this.taskForm.value).subscribe({
          next: (val : any) => {
            this._coreService.openSnackBar("Task updated!", 'done')
            this._dialogRef.close(true);
          },
          error: (err : any) => {
            console.error(err)
          }
        })
      }
    } else {
      if (this.taskForm.valid) {
        this._apiService.addTask(this.taskForm.value).subscribe({
          next: (val : any) => {
            this._coreService.openSnackBar("Task added!", 'done')
            this._dialogRef.close(true);
          },
          error: (err : any) => {
            console.error(err)
          }
        })
      }
    }
  }

  
}
