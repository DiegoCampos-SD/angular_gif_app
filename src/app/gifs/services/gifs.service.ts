import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGIFResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'JFt0652AReMsb2QWGZWyfoDBZynMOMje';
  private urlApi: string = 'https://api.giphy.com/v1/gifs';
  private _record: string[] = [];

  public results: Gif[] = [];

  get record() {
    return [...this._record];
  }

  constructor(private http: HttpClient) {
    this._record = JSON.parse(localStorage.getItem('record')!) || [];
    this.results = JSON.parse(localStorage.getItem('lastResult')!) || [];
  }

  searchGifs(query: string) {
    query = query.trim().toLocaleLowerCase();
    if (!this._record.includes(query)) {
      this._record.unshift(query);
      this._record = this._record.splice(0, 10);
      localStorage.setItem('record', JSON.stringify(this._record));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '20')
      .set('q', query);

    this.http
      .get<SearchGIFResponse>(`${this.urlApi}/search`, { params })
      .subscribe((resp) => {
        this.results = resp.data;
        localStorage.setItem('lastResult', JSON.stringify(this.results));
      });
  }
}
