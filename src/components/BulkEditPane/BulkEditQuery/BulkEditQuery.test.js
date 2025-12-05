import React from 'react';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { BulkEditQuery } from './BulkEditQuery';
import { useSearchParams } from '../../../hooks';
import { getBulkOperationStatsByStep } from '../BulkEditListResult/PreviewLayout/helpers';
import { APPROACHES, EDITING_STEPS } from '../../../constants';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }) => id,
  }),
  FormattedMessage: ({ id }) => <span>{id}</span>,
}));

jest.mock('@folio/stripes/core', () => ({
  AppIcon: () => <span>AppIcon</span>,
  TitleManager: ({ children }) => <div>{children}</div>,
  useStripes: () => ({}),
}));

jest.mock('@folio/stripes/components', () => ({
  Pane: ({ children, paneTitle, paneSub }) => (
    <div>
      <span>{paneTitle}</span>
      <span>{paneSub}</span>
      {children}
    </div>
  ),
}));

jest.mock('../BulkEditListResult', () => ({
  BulkEditListResult: () => <span>BulkEditListResult</span>,
}));

jest.mock('../../../hooks', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../BulkEditListResult/PreviewLayout/helpers', () => ({
  getBulkOperationStatsByStep: jest.fn(),
}));

const renderBulkEditQuery = (props = {}) => {
  return render(
    <BulkEditQuery
      bulkDetails={{}}
      actionMenu={() => { }}
      {...props}
    >
      {() => <span>Children</span>}
    </BulkEditQuery>
  );
};

describe('BulkEditQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParams.mockReturnValue({
      step: 'step',
      approach: 'approach',
      currentRecordType: 'ITEM',
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: false,
      countOfRecords: 0,
    });
  });

  it('renders default title when not in query criteria', () => {
    renderBulkEditQuery();
    expect(screen.getByText('ui-bulk-edit.meta.title')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.list.logSubTitle')).toBeInTheDocument();
  });

  it('renders query title when in query criteria', () => {
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: true,
      countOfRecords: 10,
    });
    renderBulkEditQuery({ bulkDetails: { fqlQuery: 'query' } });
    expect(screen.getByText('ui-bulk-edit.meta.query.title')).toBeInTheDocument();
  });

  it('renders marc query title when in query criteria and approach is MARC', () => {
    useSearchParams.mockReturnValue({
      step: 'step',
      approach: APPROACHES.MARC,
      currentRecordType: 'ITEM',
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: true,
      countOfRecords: 10,
    });
    renderBulkEditQuery({ bulkDetails: { fqlQuery: 'query' } });
    expect(screen.getByText('ui-bulk-edit.meta.query.title.marc')).toBeInTheDocument();
  });

  it('renders matched subtitle when step is UPLOAD', () => {
    useSearchParams.mockReturnValue({
      step: EDITING_STEPS.UPLOAD,
      approach: 'approach',
      currentRecordType: 'ITEM',
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: true,
      countOfRecords: 10,
    });
    renderBulkEditQuery({ bulkDetails: { fqlQuery: 'query' } });
    expect(screen.getByText('ui-bulk-edit.list.logSubTitle.matched')).toBeInTheDocument();
  });

  it('renders changed subtitle when step is not UPLOAD', () => {
    useSearchParams.mockReturnValue({
      step: EDITING_STEPS.COMMIT,
      approach: 'approach',
      currentRecordType: 'ITEM',
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: true,
      countOfRecords: 10,
    });
    renderBulkEditQuery({ bulkDetails: { fqlQuery: 'query' } });
    expect(screen.getByText('ui-bulk-edit.list.logSubTitle.changed')).toBeInTheDocument();
  });
});
