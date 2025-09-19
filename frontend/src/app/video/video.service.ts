import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Video } from "./types";
import { ConfigService } from "../config/config.service";


@Injectable({
    providedIn: 'root'
  })
export class VideoService {

    constructor(private http: HttpClient, private configService: ConfigService) {}

    getVideos(): Observable<Video[]> {
        return this.http.get<Video[]>(`${this.configService.apiUrl}/video`);
    }

    getVideoById(id: string): Observable<Video> {
        return this.http.get<Video>(`${this.configService.apiUrl}/video/${id}`);
    }

    searchVideos(query: string): Observable<Video[]> {
        return this.http.get<Video[]>(`${this.configService.apiUrl}/video/search?q=${encodeURIComponent(query)}`);
    }
}