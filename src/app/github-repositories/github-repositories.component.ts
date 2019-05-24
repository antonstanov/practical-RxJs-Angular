import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

// Rx
import {Observable, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, shareReplay, switchMap, take,} from 'rxjs/operators';
import {filterByOwnerType} from '../../shared/operators/filter-by-owner-type';

// interfaces
import {RepositorySearchResponse} from '../../shared/models/repository-search-response.interface';
import {Organization} from '../../shared/models/organization.interface';
import {Repository} from '../../shared/models/repository.interface';
import {OwnerType} from '../../shared/enums/owner-type.enum';

const GITHUB_URL = 'https://api.github.com/search/repositories';

@Component({
  selector: 'app-github-repositories',
  templateUrl: './github-repositories.component.html',
  styleUrls: ['./github-repositories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubRepositoriesComponent implements OnInit {
  queries$ = new Subject<string>();
  selectedRepository$ = new Subject<Repository | undefined>();
  repositories$: Observable<Repository[]>;
  organizations$: Observable<Organization[]>;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.repositories$ = this.queries$.pipe(
      map((query: string) => query ? query.trim() : ''),
      filter(Boolean),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => this.fetchRepositories(query)),
      filterByOwnerType(OwnerType.User),
      shareReplay(1)
    );

    this.organizations$ = this.selectedRepository$.pipe(
      map((repository) => repository && repository.owner.organizations_url),
      switchMap((url: string | false) => {
        return url ? this.fetchUserOrganizations(url) : of(undefined);
      }),
    );
  }

  onTextChange(query: string) {
    this.queries$.next(query);
  }

  onRepositoryMouseEvent(repository: Repository | undefined) {
    this.selectedRepository$.next(repository);
  }

  exportRepos() {
    this.repositories$.pipe(take(1)).subscribe(repos => {
      console.log(repos);
      // export function here });
    });
  }

  private fetchRepositories(query: string): Observable<Repository[]> {
    const params = { q: query };

    return this.http
      .get<RepositorySearchResponse>(GITHUB_URL, { params })
      .pipe(
        map((response: RepositorySearchResponse) => response.items)
      );
  }

  private fetchUserOrganizations(url: string): Observable<Organization[]> {
    return this.http.get<Organization[]>(url);
  }
}
