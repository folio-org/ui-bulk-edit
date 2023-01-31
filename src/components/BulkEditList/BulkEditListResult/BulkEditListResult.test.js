import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { QueryClientProvider } from 'react-query';
import { runAxeTest } from '@folio/stripes-testing';
import { useOkapiKy } from '@folio/stripes/core';

import { queryClient } from '../../../../test/jest/utils/queryClient';
import { TYPE_OF_PROGRESS } from '../../../constants';

import '../../../../test/jest/__mock__';
import { RootContext } from '../../../context/RootContext';
import BulkEditListResult from './BulkEditListResult';


jest.mock('./Preview/PreviewAccordion', () => ({
  PreviewAccordion: () => 'PreviewAccordion',
}));

jest.mock('../../../API', () => ({
  useJob: () => ({
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
  useUserGroupsMap: () => ({}),
}));

const setCountOfRecordsMock = jest.fn();

const renderBulkEditResult = (history, typeOfProgress = TYPE_OF_PROGRESS.INITIAL) => {
  render(
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <RootContext.Provider value={{ setNewBulkFooterShown: jest.fn(),
          setCountOfRecords: setCountOfRecordsMock,
          fileName: 'TestMock.cvs' }}
        >
          <BulkEditListResult
            updatedId="1"
            typeOfProgress={typeOfProgress}
          />
        </RootContext.Provider>
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

    history.push('/bulk-edit/1/preview?fileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history);

    expect(screen.getByTestId('spiner')).toBeVisible();
  });

  it('displays title', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/progress?fileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.INITIAL);

    expect(screen.getByText(/progressBar.title/)).toBeVisible();
  });

  it('displays processed title', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/progress?processedFileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.PROCESSED);

    expect(screen.getByText(/progressBar.title/)).toBeVisible();
  });

  it('displays processed preview', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/preview?processedFileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.PROCESSED);

    expect(screen.getByText(/recordsSuccessfullyChanged/)).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/processed?processedFileName=Mock.csv&capabilities=USERS');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.PROCESSED);

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
