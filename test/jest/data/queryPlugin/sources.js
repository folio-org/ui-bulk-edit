import { delayedResponse } from '../../helpers';
import { content } from './content';
import { entityType } from './entityType';

export const testQueryDataSource = () => {
  const testQueryId = 'query-id-1';

  return delayedResponse(3000, { content, entityType, testQueryId });
};

export const runQueryDataSource = () => {
  return delayedResponse(1000, true);
};

export const entityTypeDataSource = () => {
  return delayedResponse(1000, entityType);
};

export const contentDataSource = () => {
  return delayedResponse(1000, content);
};
