import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { QueryClientProvider } from 'react-query';
import BulkEditListResult from './BulkEditListResult';
import { queryClient } from '../../../../test/jest/utils/queryClient';
import { TYPE_OF_PROGRESS } from '../../../constants';

import '../../../../test/jest/__mock__';

jest.mock('./Preview/PreviewAccordion', () => ({
  PreviewAccordion: () => 'PreviewAccordion',
}));

jest.mock('../../../API', () => ({
  useDownloadLinks: () => ({
    data: {
      files: ['file1.csv', 'file2.csv'],
      progress: 55,
    },
  }),
  usePreviewRecords: () => ({
    users: [{ id: 1 }, { id: 2 }],
  }),
  useErrorsList: () => ({
    errors: [{ message: 'id,text' }],
  }),
  useProgressStatus: () => ({
    data: {
      progress: 10,
    },
  }),
  useUserGroupsMap: () => ({}),
}));

const renderBulkEditResult = (history, typeOfProgress = TYPE_OF_PROGRESS.INITIAL) => {
  render(
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <BulkEditListResult
          updatedId="1"
          typeOfProgress={typeOfProgress}
        />
      </QueryClientProvider>
    </Router>,
  );
};

describe('BulkEditListResult', () => {
  it('displays empty message', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit?capabilities=USERS');

    renderBulkEditResult(history);

    expect(screen.getByText(/list.result.emptyMessage/)).toBeVisible();
  });

  it('displays fileName field for initial preview', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/initial?fileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history);

    expect(screen.getByText(/preview.file.title/)).toBeVisible();
  });

  it('displays fileName field for processed preview', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/processed?processedFileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history);

    expect(screen.getByText(/preview.file.title/)).toBeVisible();
  });

  it('displays title', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/initialProgress?fileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.INITIAL);

    expect(screen.getByText(/progressBar.title/)).toBeVisible();
  });

  it('displays processed title', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/processedProgress?fileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.PROCESSED);

    expect(screen.getByText(/progressBar.title/)).toBeVisible();
  });
});
