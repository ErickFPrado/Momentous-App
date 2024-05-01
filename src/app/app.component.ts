import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { TaskFormComponent } from './task-form/task-form.component';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from './services/api.service';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatDialogModule, MatIconModule, MatButtonModule, TaskFormComponent, 
    MatInputModule, MatTableModule, MatPaginator, MatPaginatorModule, MatSort, MatSortModule, MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'momentous-app';


  displayedColumns: string[] = ['title', 'date', 'time', 'timeDuration', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private _dialog: MatDialog, 
    private _taskService: ApiService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getTaskList();
  }


    openAddEditTaskForm() {
      const dialogRef = this._dialog.open(TaskFormComponent)
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getTaskList();
          }
        }
      })
    } 

    getTaskList() {
      this._taskService.getTask().subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator
        }, error: console.log
      })
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    deleteTask(id: number) {
      this._taskService.deleteTask(id).subscribe({
        next: (res) => {
          this._coreService.openSnackBar('Task deleted!', 'done');
          this.getTaskList();
        }, error: console.log
      })
    }

    openEditTaskForm(data: any) {
      const dialogRef = this._dialog.open(TaskFormComponent, {
        data
      })
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getTaskList();
          }
        }
      })
    } 

}
