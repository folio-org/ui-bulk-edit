import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import '../../../../test/jest/__mock__';
import { bulkEditLogsData } from '../../../../test/jest/__mock__/fakeData';
import { queryClient } from '../../../../test/jest/utils/queryClient';
import {
  JOB_STATUSES,
  FILE_KEYS, CAPABILITIES,
} from '../../../constants';
import BulkEditLogsActions from './BulkEditLogsActions';
import * as BulkPermissionsHook from '../../../hooks/useBulkPermissions';

const bulkOperation = {
  ...bulkEditLogsData[0],
  status: JOB_STATUSES.DATA_MODIFICATION,
  [FILE_KEYS.MATCHING_RECORDS_LINK]: FILE_KEYS.MATCHING_RECORDS_LINK,
  [FILE_KEYS.UPDATED_RECORDS_LINK]: FILE_KEYS.UPDATED_RECORDS_LINK,
  [FILE_KEYS.MATCHING_ERRORS_LINK]: FILE_KEYS.MATCHING_ERRORS_LINK,
  [FILE_KEYS.UPDATED_ERRORS_LINK]: FILE_KEYS.UPDATED_ERRORS_LINK,
  [FILE_KEYS.PROPOSED_CHANGES_LINK]: FILE_KEYS.PROPOSED_CHANGES_LINK,
  [FILE_KEYS.TRIGGERING_FILE]: FILE_KEYS.TRIGGERING_FILE,
};

const renderBulkEditLogsActions = ({ item = bulkOperation } = {}) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BulkEditLogsActions item={item} />
    </QueryClientProvider>,
  );
};

describe('BulkEditLogsActions', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({});
  });

  it('should display actions', async () => {
    renderBulkEditLogsActions();

    expect(screen.queryByText('ui-bulk-edit.list.actions.download')).not.toBeNull();
  });

  it('should not display actions for USER entityType if there aren`t user view perms', async () => {
    jest.spyOn(BulkPermissionsHook, 'useBulkPermissions')
      .mockImplementation(() => ({ hasUsersViewPerms: false }));

    renderBulkEditLogsActions({ item: { ...bulkOperation, entityType: CAPABILITIES.USER } });

    expect(screen.queryByText('ui-bulk-edit.list.actions.download')).toBeNull();
  });

  Object.values(FILE_KEYS).forEach((fileKey) => {
    it(`should display action to download ${fileKey} when it is defined`, () => {
      renderBulkEditLogsActions();

      expect(screen.getByTestId(fileKey)).toBeDefined();
    });
  });
});
