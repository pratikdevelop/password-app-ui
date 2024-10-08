import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { saveAs } from 'file-saver'; // Install file-saver using npm


@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = `${environment[`api_url`]}/passwords`;
  filteredPasswords$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  constructor(private http: HttpClient) { }
  getPasswords(_search?: string): Observable<any[]> {
    console.log('pp', _search);
    
    const params = new HttpParams();
    if (_search) {
      params.set('search', _search);
      }    
    return this.http.get<any[]>(`${this.apiUrl}?search=${_search}`
    )
      .pipe(
        switchMap((response: any) => {
          const decryptedPasswords = response.data.map((res: { password: string | CryptoJS.lib.CipherParams; key: string | CryptoJS.lib.WordArray; }) => {
            try {
              const decryptedPassword = CryptoJS.AES.decrypt(res.password, res.key).toString(CryptoJS.enc.Utf8);
              return { ...res, password: decryptedPassword };
            } catch (err) {
              console.error('Error decrypting password:', err);
              return throwError(new Error('Failed to decrypt password')); // Handle individual decryption errors
            }
          });
          this.filteredPasswords$.next(decryptedPasswords); // Initialize filteredPasswords$ with fetched data
          return of(decryptedPasswords);
        }),
        catchError((error: any) => {
          console.error('Error fetching or decrypting passwords:', error); // Log comprehensive error
          return throwError(error); // Re-throw the error for proper handling
        })
      );
  }

  addPassword(password: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/password`, password)
    .pipe(
      switchMap((response: any) => { // Use switchMap to transform the entire response
        const decryptedPassword = AES.decrypt(
          response.password,
          response.key
        );

        response.password = decryptedPassword.toString(CryptoJS.enc.Utf8);
        this.getPasswords();
        return of(response); // Return the modified password object
      }),
      catchError((error: any) => {
        console.error('Error updating password:', error);
        throw error; // Re-throw the error to prevent silent failures
      })
    );
  }

  deletePassword(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/password/${id}`)
      .pipe(
        catchError((error: any) => {
          console.error('Error deleting password:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }

  deleteMultiplePasswords(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/password/${ids}` )
      .pipe(
        catchError((error: any) => {
          console.error('Error deleting password:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }
  addToFavorites(passwordId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/${passwordId}/favorite`, {}); // Assuming no additional data is sent in the request body
  }

  updatePassword(_id: any, newPasswordObject: { website: any; username: any; password: string; key: string; }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/password/${_id}`, newPasswordObject)
      .pipe(
        switchMap((response: any) => { // Use switchMap to transform the entire response
          const decryptedPassword = AES.decrypt(
            response.password,
            response.key
          );

          response.password = decryptedPassword.toString(CryptoJS.enc.Utf8);
          return of(response); // Return the modified password object
        }),
        catchError((error: any) => {
          console.error('Error updating password:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  
  }

  sharePassword(passwordId: string): Observable<{ shareLink: string }> {
    return this.http.post<{ shareLink: string }>(`${this.apiUrl}/share/${passwordId}`,{})
      .pipe(
        catchError((error: any) => {
          console.error('Error generating share link:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }

  searchTags(name: string): Observable<any> {
    return this.http.get(`${environment.api_url}/tags/search/${name}`);
  }

  addTag(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/tags/tag`, payload);
  }

  exportPasswordsAsCsv(ids: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/export?ids=${ids}`, { responseType: 'blob' });
  }
  addTagToPassword(passwordId: string, tagName: string): Observable <any>{
    const body = { passwordId, tagName };
    return this.http.post(`${this.apiUrl}/add-tag`, body)
  }
  postComment(passwordId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${passwordId}/comments`, {content})
    .pipe(
      catchError((error: any) => {
        console.error('Error deleting password:', error);
        throw error; // Re-throw the error to prevent silent failures
      })
    );
  }
}
