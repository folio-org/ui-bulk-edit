import partititon from 'lodash/partition';
import { useCallback, useEffect, useRef } from 'react';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

export const PUBLISH_COORDINATOR_STATUSES = {
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
  IN_PROGRESS: 'IN_PROGRESS',
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

export const usePublishCoordinator = (options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const abortController = useRef(new AbortController());

  const consortium = stripes.user?.user?.consortium;
  const baseApi = `${CONSORTIA_API}/${consortium?.id}/${PUBLICATIONS_API}`;

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  const getPublicationResults = useCallback((id, { signal }) => {
    return ky.get(`${baseApi}/${id}/results`, { signal })
      .json()
      .then(formatPublicationResult);
  }, [ky, baseApi]);

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
      .then(res => getPublicationResponse(res, { signal }));
  }, [baseApi, getPublicationResponse, ky, options.signal]);

  return {
    initPublicationRequest,
    getPublicationDetails,
  };
};
