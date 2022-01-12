import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import '../../../../test/jest/__mock__';

import BulkEditListResult from './BulkEditListResult';

jest.mock('./Preview/PreviewAccordion', () => ({
  PreviewAccordion: () => 'PreviewAccordion',
}));

const renderBulkEditResult = (history, fileName = undefined, fileUpdatedName = undefined) => {
  render(
    <Router history={history}>
      <BulkEditListResult fileUploadedName={fileName} fileUpdatedName={fileUpdatedName} />
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

    history.push('/bulk-edit/1?fileName=Mock.csv');

    renderBulkEditResult(history);

    expect(screen.getByText(/preview.file.title/)).toBeVisible();
  });

  it('displays fileName field', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1?queryText=%28patronGroup%3D%3D"1"');

    renderBulkEditResult(history);

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
  });

  it('displays title', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/progress');

    renderBulkEditResult(history, undefined, 'TestTitle');

    expect(screen.getByText(/TestTitle/)).toBeVisible();
  });
});
