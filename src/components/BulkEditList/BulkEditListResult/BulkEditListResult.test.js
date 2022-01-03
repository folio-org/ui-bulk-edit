import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import '../../../../test/jest/__mock__';

import BulkEditListResult from './BulkEditListResult';

jest.mock('./Preview/PreviewList', () => ({
  PreviewList: () => 'PreviewList',
}));

const renderBulkEditResult = (history, fileName = undefined) => {
  render(
    <Router history={history}>
      <BulkEditListResult fileUploadedName={fileName} />
    </Router>,
  );
};

describe('BulkEditListResult', () => {
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
});
