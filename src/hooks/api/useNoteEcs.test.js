import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';
import { useNamespace } from '@folio/stripes/core';

import { usePublishCoordinator } from '../usePublishCoordinator';
import { getMappedAndSortedNotes } from '../../utils/helpers';
import { useNotesEcs } from './useNoteEcs';


jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
}));

jest.mock('../usePublishCoordinator', () => ({
  usePublishCoordinator: jest.fn(),
}));

jest.mock('../../utils/helpers', () => ({
  getMappedAndSortedNotes: jest.fn(),
}));

describe('useNotesEcs', () => {
  const mockNamespace = 'testNamespace';
  const mockInitPublicationRequest = jest.fn();
  const mockFormatMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNamespace.mockReturnValue([mockNamespace]);
    usePublishCoordinator.mockReturnValue({
      initPublicationRequest: mockInitPublicationRequest,
    });
    useIntl.mockReturnValue({
      formatMessage: mockFormatMessage,
    });
  });

  it('returns default values when query is fetching or no data is available', () => {
    useQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    });

    const { result } = renderHook(() => useNotesEcs({
      namespaceKey: 'notes',
      tenants: ['tenant1'],
      url: 'notes',
      type: 'example',
      categoryId: 'category-id',
      noteKey: 'notes',
      optionType: 'type',
      parameterKey: 'key',
    }));

    expect(result.current.notesEcs).toEqual([]);
    expect(result.current.isFetching).toBe(true);
  });

  it('formats notes data correctly when query returns data', async () => {
    const mockData = [
      {
        tenantId: 'tenant1',
        response: {
          notes: [
            { id: 'note1', name: 'Note 1' },
            { id: 'note2', name: 'Note 2' },
          ],
        },
      },
    ];
    const mockSortedNotes = [
      { id: 'note1', name: 'Note 1 (tenant1)', tenantName: 'tenant1' },
      { id: 'note2', name: 'Note 2 (tenant1)', tenantName: 'tenant1' },
    ];

    useQuery.mockReturnValue({
      data: mockData,
      isFetching: false,
    });

    mockInitPublicationRequest.mockResolvedValue({
      publicationResults: mockData,
    });

    getMappedAndSortedNotes.mockReturnValue(mockSortedNotes);

    const { result } = renderHook(() => useNotesEcs({
      namespaceKey: 'notes',
      tenants: ['tenant1'],
      url: 'notes',
      type: 'example',
      categoryId: 'category-id',
      noteKey: 'notes',
      optionType: 'type',
      parameterKey: 'key',
    }));

    expect(result.current.notesEcs).toEqual(mockSortedNotes);
    expect(getMappedAndSortedNotes).toHaveBeenCalledWith({
      notes: [
        { id: 'note1', name: 'Note 1 (tenant1)', tenantName: 'tenant1' },
        { id: 'note2', name: 'Note 2 (tenant1)', tenantName: 'tenant1' },
      ],
      categoryName: mockFormatMessage({ id: 'category-id' }),
      type: 'type',
      key: 'key',
    });
    expect(result.current.isFetching).toBe(false);
  });

  it('handles errors gracefully when the query fails', async () => {
    useQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
    });

    mockInitPublicationRequest.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useNotesEcs({
      namespaceKey: 'notes',
      tenants: ['tenant1'],
      url: 'notes',
      type: 'example',
      categoryId: 'category-id',
      noteKey: 'notes',
      optionType: 'type',
      parameterKey: 'key',
    }));

    expect(result.current.notesEcs).toEqual([]);
    expect(result.current.isFetching).toBe(false);
  });

  it('applies additional query options if provided', () => {
    const mockOptions = { retry: false };

    useQuery.mockReturnValue({
      data: [],
      isFetching: false,
    });

    renderHook(() => useNotesEcs({
      namespaceKey: 'notes',
      tenants: ['tenant1'],
      url: 'notes',
      type: 'example',
      categoryId: 'category-id',
      noteKey: 'notes',
      optionType: 'type',
      parameterKey: 'key',
      options: mockOptions,
    }));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
  });
});
