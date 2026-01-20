import { useOkapiKy } from '@folio/stripes/core';

export const useQueryPlugin = (recordType) => {
  const ky = useOkapiKy();

  const entityTypeDataSource = async () => {
    if (!recordType) return null;

    return ky.get(`entity-types/${recordType}`).json();
  };

  const queryDetailsDataSource = async ({ queryId, includeContent, offset, limit }) => {
    const searchParams = {
      includeResults: includeContent,
      offset,
      limit
    };

    const response = ky.get(`query/${queryId}`, { searchParams });

    return response.json();
  };

  const testQueryDataSource = async ({ fqlQuery }) => {
    const response = ky.post('query', { json: {
      entityTypeId: recordType,
      fqlQuery: JSON.stringify(fqlQuery)
    } });
    return response.json();
  };

  const getParamsSource = async ({ entityTypeId, columnName, searchValue }) => {
    return ky.get(`entity-types/${entityTypeId}/field-values`, {
      searchParams: {
        field: columnName,
        search: searchValue
      },
    }).json();
  };

  const getOrganizations = async (ids, property) => ky
    .get('organizations/organizations', {
      searchParams: {
        query: ids.map((id) => `id=="${id}"`).join(' or '),
        limit: ids.length,
      },
    })
    .json()
    .then((response) => response.organizations.map((org) => ({ value: org.id, label: org[property] })));

  const cancelQueryDataSource = async ({ queryId }) => {
    return ky.delete(`query/${queryId}`);
  };

  const runQueryDataSource = async ({ queryId, fqlQuery, userFriendlyQuery }) => {
    const response = ky.post('bulk-operations/query', { json: {
      queryId,
      entityTypeId: recordType,
      fqlQuery: JSON.stringify(fqlQuery),
      userFriendlyQuery
    } });
    return response.json();
  };

  return {
    entityTypeDataSource,
    queryDetailsDataSource,
    testQueryDataSource,
    getParamsSource,
    getOrganizations,
    cancelQueryDataSource,
    runQueryDataSource,
  };
};
