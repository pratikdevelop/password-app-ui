import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordService } from '../../../../services/password.service';
import { AES } from 'crypto-js';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { debounceTime, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, CommonModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './password-form.component.html',
})
export class PasswordFormComponent implements OnInit {
  passwordForm!: FormGroup;
  tags: any[] = [];
  formbuilder = inject(FormBuilder);
  passwordService= inject(PasswordService)
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PasswordFormComponent>);


  ngOnInit() : void {
    this.passwordForm = this.formbuilder.group({
      _id: [this.data?.password?._id ?? ""],
      name: [""],
      description: [""],
      website: [this.data?.password?.website ?? '', Validators.required],
      username: [this.data?.password?.username ?? '', Validators.required],
      password: [this.data?.password?.password ??'', Validators.required],
      searchTerm:['']
    });
  }

  searchTags(): void {
      this.passwordForm.get("searchTerm")?.valueChanges.pipe(
        debounceTime(500), // wait for 500ms before searching
        tap((searchTerm) => {
          this.passwordService.searchTags(searchTerm).subscribe((res) => {
            this.tags = res;
          }, (error) => {
            this.tags = [];
            console.error("Error fetching the Tags, Error: ", error);
          });
        })
      ).subscribe();
    }

  addPassword(): void {
    const fixedKey = this.generateSecureKey(32);
    const encryptedPassword = AES.encrypt(
      this.passwordForm?.value?.password,
      fixedKey
    );
    // Create the new password object  
    const newPasswordObject = {
      website: this.passwordForm?.get('website')?.value,
      username: this.passwordForm?.get('username')?.value,
      password: encryptedPassword.toString(),
      key: this.passwordForm?.value._id ? this.data?.password.key: fixedKey,
    };

    if (!this.passwordForm?.value._id) {
      this.passwordService
        .addPassword(newPasswordObject)
       
        .subscribe(() => {
          this.passwordForm?.reset(); // Clear the form
          this.dialogRef.close(true);
        });
    } else {
      // Update the password using an observable
      this.passwordService
        .updatePassword(this.passwordForm?.value._id, newPasswordObject)
        
        .subscribe(() => {
          this.passwordForm?.reset(); // Clear the form
          this.dialogRef.close(true);
        });
    }
    // Send the new password object to the backend using an observable
  }

  generateSecureKey(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  }
  createNewTag(): void {
    // implement logic to create a new tag
  }
}
