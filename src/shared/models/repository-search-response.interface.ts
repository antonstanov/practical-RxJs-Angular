import {Repository} from "./repository.interface";

export interface RepositorySearchResponse {
  incomplete_results: boolean;
  items: Repository[];
  total_count: number;
}
