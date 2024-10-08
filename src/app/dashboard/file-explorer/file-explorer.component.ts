import { ChangeDetectorRef, Component, OnInit, Pipe, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  MatTableModule } from '@angular/material/table';
import { FileService } from '../../services/file.service'; // Import your file service here
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FileUploadComponent } from '../../dialog/file-upload/file-upload.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css'],
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule, ReactiveFormsModule, FormsModule, 
    MatMenuModule,
    MatInputModule,
    MatIconModule
    
  ]
})
export class FileExplorerComponent implements OnInit {
onShareItem(arg0: any) {
throw new Error('Method not implemented.');
}
onPreviewFile(arg0: any) {
throw new Error('Method not implemented.');
}
  displayedColumns: string[] = ['filename', 'size','uploadedAt',  'actions'];
  dataSource!: any[]
  private fileService = inject(FileService);
  private changeDetectorRef = inject(ChangeDetectorRef)
  readonly commonService = inject(CommonService) 

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.getFilesAndFolders('').subscribe(files => {
      this.dataSource = files;
      this.changeDetectorRef.detectChanges();
    });
  }

  openFileDialog(): void {
    this.dialog.open(FileUploadComponent, {
      width:'600px'
    })
  }

  setFilter(fileId: string): void {
    // Implement preview functionality
  }

  performAction(fileId: string): void {
    // Implement share functionality
  }
  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }

}