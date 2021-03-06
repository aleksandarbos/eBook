import { Injectable } from '@angular/core';

import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { EBook } from 'app/ebook/main/ebook.model';
import { ServerURI } from 'app/app.globals';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class EBookService {

  constructor(private http: Http) { 
  }

  private eBooksUrl = 'api/ebooks/';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'});
  private opts:RequestOptions = new RequestOptions();
  
  
  getEBooks(): Promise<Array<EBook>> {
    this.opts.headers = this.headers;
    
    return this.http
      .get(ServerURI + this.eBooksUrl, this.opts)
      .toPromise()
      .then((response) => {
        return response.json() as Array<EBook>[];
      })
      .catch(this.handleError);
  }
  
  getEBook(id: number): Promise<EBook> {
    return this.getEBooks()
      .then(eBooks => eBooks.find(eBook => eBook.eBookId === id));
  }

  save(eBook: EBook): Promise<EBook> {
    if (eBook.eBookId) {
      return this.put(eBook);
    }
    return this.post(eBook);
  }

  delete(eBookId: number): Promise<Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${ServerURI}${this.eBooksUrl}${eBookId}`;

    return this.http
      .delete(url, { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

  // Add new EBook
  private post(eBook: EBook): Promise<EBook> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(ServerURI + this.eBooksUrl, JSON.stringify(eBook), { headers: headers })
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  // Update existing EBook
  private put(eBook: EBook): Promise<EBook> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${ServerURI}${this.eBooksUrl}${eBook.eBookId}`;

    return this.http
      .put(url, JSON.stringify(eBook), { headers: headers })
      .toPromise()
      .then(() => eBook)
      .catch(this.handleError);
  }

  filter(expression: string) {
    return this.http
    .get(ServerURI + this.eBooksUrl + "$filter=" + expression, this.opts)
    .toPromise()
    .then((response) => {
      return response.json() as Array<EBook>[];
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
