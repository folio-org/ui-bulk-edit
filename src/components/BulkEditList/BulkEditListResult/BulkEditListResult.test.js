import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../../test/jest/__mock__';

import { QueryClientProvider } from 'react-query';
import { BulkEditListResult } from './BulkEditListResult';
import { queryClient } from '../../../../test/jest/utils/queryClient';

const renderBulkEditResult = (history, fileName = undefined, fileUpdatedName = undefined) => {
  render(
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <BulkEditListResult
          fileUploadedName={fileName}
          fileUpdatedName={fileUpdatedName}
          updatedId="1"
          processedRecords={2}
        />
      </QueryClientProvider>
    </Router>,
  );
};

describe('BulkEditListResult', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            progress: {
              progress: 55,
            },
          }),
        }),
      });
  });


  it('displays empty message', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit');

    renderBulkEditResult(history);

    expect(screen.getByText(/list.result.emptyMessage/)).toBeVisible();
  });

  it('displays fileName field', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1');

    renderBulkEditResult(history, 'Mock.cvs');

    expect(screen.getByText(/Mock.cvs/)).toBeVisible();
  });

  it('displays fileName field', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/progress');

    renderBulkEditResult(history, undefined, 'TestTitle');

    expect(screen.getByText(/TestTitle/)).toBeVisible();
  });
});
