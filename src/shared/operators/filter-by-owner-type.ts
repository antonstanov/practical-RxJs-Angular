import { map } from 'rxjs/operators';

import { OwnerType } from '../enums/owner-type.enum';
import { Repository } from '../models/repository.interface';

export const filterByOwnerType = (type: OwnerType) => {
  const filterFn = (repository: Repository) => repository.owner.type === type;

  return map((repositories: Repository[]) => {
    return repositories.filter(filterFn);
  });
};
