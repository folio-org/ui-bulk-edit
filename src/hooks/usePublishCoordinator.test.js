import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@testing-library/react-hooks';
import { useOkapiKy } from '@folio/stripes/core';

import {
  pcPostRequest,
  pcPublicationDetails,
  pcPublicationResults,
} from '../../test/jest/utils/publishCoordinator';

import {
  TIMEOUT,
  usePublishCoordinator,
  PUBLISH_COORDINATOR_STATUSES
} from './usePublishCoordinator';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(),
  post: jest.fn(),
};

const publicationResults = pcPublicationResults.publicationResults.map(({ response, ...rest }) => ({
  response: JSON.parse(response),
  ...rest,
}));
const response = {
  publicationResults,
  publicationErrors: [],
  totalRecords: pcPublicationResults.totalRecords,
};

const getDetailsMock = jest.fn((status) => Promise.resolve({ ...pcPublicationDetails, status }));
const getResultsMock = jest.fn(() => Promise.resolve(pcPublicationResults));

const getMockedImplementation = (status = PUBLISH_COORDINATOR_STATUSES.COMPLETE) => (url) => ({
  json: () => Promise.resolve(url.endsWith('/results') ? getResultsMock() : getDetailsMock(status)),
});

describe('usePublishCoordinator.test', () => {
  beforeEach(() => {
    getDetailsMock.mockClear();
    getResultsMock.mockClear();
    kyMock.get.mockClear().mockImplementation(getMockedImplementation());
    kyMock.post.mockClear().mockImplementation(() => ({
      json: () => Promise.resolve(pcPublicationDetails),
    }));
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should initiate publish coordinator request to get records from provided tenants', async () => {
    const { result } = renderHook(() => usePublishCoordinator(), { wrapper });

    const { initPublicationRequest } = result.current;

    expect(await initPublicationRequest({
      ...pcPostRequest,
      url: pcPostRequest.url.slice(1),
    })).toEqual(response);
    expect(kyMock.post).toHaveBeenCalled();
  });

  it('should return results if PC has managed to process the request on the first turn', async () => {
    kyMock.post.mockReturnValue({ json: () => Promise.resolve({
      ...pcPublicationDetails,
      status: PUBLISH_COORDINATOR_STATUSES.COMPLETE,
    }) });

    const { result } = renderHook(() => usePublishCoordinator(), { wrapper });

    const { initPublicationRequest } = result.current;

    expect(await initPublicationRequest(pcPostRequest)).toEqual(response);
  });

  it('should poll publish coordinator until the publication status is \'In progress\'', async () => {
    kyMock.get
      .mockImplementationOnce(getMockedImplementation(PUBLISH_COORDINATOR_STATUSES.IN_PROGRESS))
      .mockImplementationOnce(getMockedImplementation(PUBLISH_COORDINATOR_STATUSES.IN_PROGRESS))
      .mockImplementation(getMockedImplementation(PUBLISH_COORDINATOR_STATUSES.COMPLETE));

    const { result } = renderHook(() => usePublishCoordinator(), { wrapper });

    const { initPublicationRequest } = result.current;

    expect(await initPublicationRequest(pcPostRequest)).toEqual(response);
    expect(getDetailsMock).toHaveBeenCalledTimes(3);
    expect(getResultsMock).toHaveBeenCalledTimes(1);
  }, TIMEOUT * 3);

  describe('Errors', () => {
    it('should format publish coordinator result with \'Error\' status', async () => {
      const errorMessage = 'Test error message';
      const errorResult = {
        tenantId: pcPostRequest.tenants[0],
        response: errorMessage,
        statusCode: 400,
      };

      getResultsMock.mockClear().mockImplementation(() => ({
        publicationResults: [errorResult],
      }));

      const { result } = renderHook(() => usePublishCoordinator(), { wrapper });

      const { initPublicationRequest } = result.current;

      return expect(await initPublicationRequest(pcPostRequest)).toEqual(expect.objectContaining({
        publicationErrors: [errorResult],
      }));
    });
  });
});
