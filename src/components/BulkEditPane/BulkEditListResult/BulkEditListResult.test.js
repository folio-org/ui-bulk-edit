import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { QueryClientProvider } from 'react-query';

import { render, screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';

import { FormattedMessage } from 'react-intl';
import React from 'react';
import { queryClient } from '../../../../test/jest/utils/queryClient';
import { TYPE_OF_PROGRESS } from '../../../constants';

import { RootContext } from '../../../context/RootContext';
import BulkEditListResult from './BulkEditListResult';
import { useBulkOperationDetails } from '../../../hooks/api';

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
}));

const setCountOfRecordsMock = jest.fn();

const renderBulkEditResult = (
  history,
  typeOfProgress = TYPE_OF_PROGRESS.INITIAL,
  title = <FormattedMessage id="ui-bulk-edit.preview.file.title" values={{ fileUploadedName: 'fileName' }} />
) => {
  render(
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <RootContext.Provider value={{
          setCountOfRecords: setCountOfRecordsMock,
          fileName: 'TestMock.cvs',
          title,
        }}
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
  it('displays empty message with identifier tab', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit?capabilities=USERS&criteria=identifier');

    renderBulkEditResult(history);

    expect(screen.getByText(/list.result.emptyMessage/)).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit?capabilities=USERS&criteria=identifier');

    renderBulkEditResult(history);

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('displays empty message with query tab', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit?capabilities=USERS&criteria=query');

    renderBulkEditResult(history);

    expect(screen.getByText(/list.result.emptyMessage/)).toBeVisible();
  });

  it('displays query-specific empty message with query tab and no capability', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit?criteria=query');

    renderBulkEditResult(history);

    expect(screen.getByText(/list.result.emptyMessage.query/)).toBeVisible();
  });

  it('displays fileName field for initial preview', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/preview?fileName=Mock.csv&capabilities=USERS&step=UPLOAD&criteria=identifier');

    renderBulkEditResult(history);

    expect(screen.getByText('ui-bulk-edit.preview.file.title')).toBeVisible();
  });

  it('displays title', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/preview?fileName=Mock.csv&capabilities=USERS&criteria=identifier&progress=identifier');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.INITIAL);

    expect(screen.getByText(/progressBar.title/)).toBeVisible();
  });

  it('displays query tab title', () => {
    const history = createMemoryHistory();

    useBulkOperationDetails.mockReturnValue({ bulkDetails: { userFriendlyQuery: 'query', fqlQuery: 'fqlQuery' } });

    history.push('/bulk-edit/1/preview?fileName=Mock.csv&capabilities=USERS&criteria=query');

    renderBulkEditResult(
      history,
      TYPE_OF_PROGRESS.INITIAL,
      <FormattedMessage id="ui-bulk-edit.preview.query.title" values={{ queryText: 'query' }} />
    );

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
  });

  it('displays identifier tab title', () => {
    const history = createMemoryHistory();

    useBulkOperationDetails.mockReturnValue({ bulkDetails: { userFriendlyQuery: null, fqlQuery: null } });

    history.push('/bulk-edit/1/preview?fileName=Mock.csv&capabilities=USERS&criteria=identifier');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.INITIAL);

    expect(screen.getByText(/preview.file.title/)).toBeVisible();
  });

  it('displays processed title', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/preview?processedFileName=Mock.csv&capabilities=USERS&criteria=identifier&progress=identifier');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.PROCESSED);

    expect(screen.getByText(/progressBar.title/)).toBeVisible();
  });

  it('displays processed preview', () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/preview?processedFileName=Mock.csv&capabilities=USERS&criteria=identifier');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.PROCESSED);

    expect(screen.getByText(/recordsSuccessfullyChanged/)).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    const history = createMemoryHistory();

    history.push('/bulk-edit/1/processed?processedFileName=Mock.csv&capabilities=USERS&criteria=identifier');

    renderBulkEditResult(history, TYPE_OF_PROGRESS.PROCESSED);

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
