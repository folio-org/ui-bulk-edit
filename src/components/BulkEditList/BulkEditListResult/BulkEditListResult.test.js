import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { QueryClientProvider } from 'react-query';

import { render, screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';

import { queryClient } from '../../../../test/jest/utils/queryClient';
import { TYPE_OF_PROGRESS } from '../../../constants';

import { RootContext } from '../../../context/RootContext';
import BulkEditListResult from './BulkEditListResult';

jest.mock('./Preview/PreviewAccordion', () => ({
  PreviewAccordion: () => 'PreviewAccordion',
}));

jest.mock('../../../hooks/api', () => ({
  ...jest.requireActual('../../../hooks/api'),
  useBulkOperationDetails: jest.fn().mockReturnValue({ bulkDetails: {} }),
  useRecordsPreview: () => ({
    contentData: [],
  }),
  useErrorsPreview: () => ({
    errors: [],
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

    history.push('/bulk-edit/1/preview?fileName=Mock.csv&capabilities=USERS&step=UPLOAD');

    renderBulkEditResult(history);

    expect(screen.getByText('ui-bulk-edit.preview.file.title')).toBeVisible();
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
