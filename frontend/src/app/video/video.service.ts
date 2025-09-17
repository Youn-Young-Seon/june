import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Video } from "./types";


@Injectable({
    providedIn: 'root'
  })
export class VideoService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {}

    getVideos(): Observable<Video[]> {
        return this.http.get<Video[]>(`${this.apiUrl}/video`);
    }

    getVideoById(id: string): Observable<Video> {
        return this.http.get<Video>(`${this.apiUrl}/video/${id}`);
    }

    searchVideos(query: string): Observable<Video[]> {
        return this.http.get<Video[]>(`${this.apiUrl}/video/search?q=${encodeURIComponent(query)}`);
    }
}