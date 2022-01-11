import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import * as useProgressStatus from '../../../API/useProgressStatus';

import '../../../../test/jest/__mock__';

import { BulkEditListResult } from './BulkEditListResult';

const renderBulkEditResult = (history, fileName = undefined, fileUpdatedName = undefined) => {
  render(
    <Router history={history}>
      <BulkEditListResult
        fileUploadedName={fileName}
        fileUpdatedName={fileUpdatedName}
        updatedId="1"
        processedRecords={2}
      />
    </Router>,
  );
};

describe('BulkEditListResult', () => {
  jest.spyOn(useProgressStatus, 'useProgressStatus').mockImplementation(() => ({
    data: {
      progress: {
        progress: 55,
      },
    },
  }));

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
