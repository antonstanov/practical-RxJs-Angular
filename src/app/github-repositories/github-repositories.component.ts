import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositorySearchResponse } from '../../shared/models/repository-search-response.interface';

const GITHUB_URL = 'https://api.github.com/search/repositories';

@Component({
  selector: 'app-github-repositories',
  templateUrl: './github-repositories.component.html',
  styleUrls: ['./github-repositories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubRepositoriesComponent {
  searchResult$: Observable<RepositorySearchResponse>;

  constructor(private http: HttpClient) {
  }

  onTextChange(query: string) {
    this.searchResult$ = this.fetchRepositories(query);
  }

  private fetchRepositories(query: string): Observable<RepositorySearchResponse> {
    const params = { q: query };
    return this.http.get<RepositorySearchResponse>(GITHUB_URL, { params });
  }
}
