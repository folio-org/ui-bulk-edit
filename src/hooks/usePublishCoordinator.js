import partititon from 'lodash/partition';
import { useCallback, useRef } from 'react';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import { useErrorMessages } from './useErrorMessages';
import { useTenants } from '../context/TenantsContext';


export const PUBLISH_COORDINATOR_STATUSES = {
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
  IN_PROGRESS: 'IN_PROGRESS',
};

export const PUBLISH_COORDINATOR_STATUSES_METHODS = {
  GET: 'GET'
};

export const PUBLICATIONS_API = 'publications';
export const CONSORTIA_API = 'consortia';


export const TIMEOUT = 2500;

const formatPublicationResult = ({ publicationResults, totalRecords }) => {
  const [results, errors] = partititon(publicationResults, ({ statusCode }) => statusCode >= 200 && statusCode < 300);

  const formattedResults = results.map(({ response, ...rest }) => ({
    response: JSON.parse(response),
    ...rest,
  }));

  return {
    publicationResults: formattedResults,
    publicationErrors: errors,
    totalRecords,
  };
};

const filterPublicationResult = (publicationResults) => (showLocal) => {
  if (showLocal) return publicationResults;

  return publicationResults.filter(({ source }) => source !== 'local');
};

export const usePublishCoordinator = (namespace, options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const { showLocal } = useTenants();
  const abortController = useRef(new AbortController());
  const { showExternalModuleError } = useErrorMessages({ path: CONSORTIA_API });

  const consortium = stripes.user?.user?.consortium;
  const baseApi = `${CONSORTIA_API}/${consortium?.id}/${PUBLICATIONS_API}`;

  const getPublicationResults = useCallback((id, { signal }) => {
    return ky.get(`${baseApi}/${id}/results`, { signal })
      .json()
      .then(formatPublicationResult)
      .catch(showExternalModuleError);
  }, [ky, baseApi, showExternalModuleError]);

  const getPublicationDetails = useCallback(async (requestId, { signal } = {}) => {
    const { id, status } = await ky.get(`${baseApi}/${requestId}`, { signal }).json();

    if (status !== PUBLISH_COORDINATOR_STATUSES.IN_PROGRESS) return getPublicationResults(id, { signal });

    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));

    return !signal?.aborted
      ? getPublicationDetails(id, { signal })
      : Promise.reject(signal);
  }, [baseApi, getPublicationResults, ky]);

  const getPublicationResponse = useCallback(({ id, status }, { signal }) => {
    if (status !== PUBLISH_COORDINATOR_STATUSES.IN_PROGRESS) return getPublicationResults(id, { signal });

    return getPublicationDetails(id, { signal });
  }, [getPublicationDetails, getPublicationResults]);

  const initPublicationRequest = useCallback(({ url, ...publication }) => {
    abortController.current = new AbortController();
    const signal = options.signal || abortController.current.signal;
    const json = {
      // Publications API requires `url` value to start with slash (`/`)
      url: url.startsWith('/') ? url : `/${url}`,
      ...publication,
    };

    return ky.post(baseApi, { json, signal })
      .json()
      .then(res => getPublicationResponse(res, { signal }))
      .then(filterPublicationResult(showLocal))
      .catch(showExternalModuleError);
  }, [baseApi, getPublicationResponse, ky, showLocal, options.signal, showExternalModuleError]);

  return {
    initPublicationRequest,
    getPublicationDetails,
  };
};
