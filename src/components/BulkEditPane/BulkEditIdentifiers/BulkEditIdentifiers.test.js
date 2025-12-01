import React from 'react';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { BulkEditIdentifiers } from './BulkEditIdentifiers';
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

const renderBulkEditIdentifiers = (props = {}) => {
  return render(
    <BulkEditIdentifiers
      bulkDetails={{}}
      actionMenu={() => { }}
      {...props}
    >
      {() => <span>Children</span>}
    </BulkEditIdentifiers>
  );
};

describe('BulkEditIdentifiers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParams.mockReturnValue({
      step: 'step',
      approach: 'approach',
      currentRecordType: 'ITEM',
      processedFileName: null,
      initialFileName: null,
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: false,
      countOfRecords: 0,
    });
  });

  it('renders default title when not in identifier criteria', () => {
    renderBulkEditIdentifiers();
    expect(screen.getByText('ui-bulk-edit.meta.title')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.list.logSubTitle')).toBeInTheDocument();
  });

  it('renders uploaded file title when in identifier criteria and file name exists', () => {
    useSearchParams.mockReturnValue({
      step: 'step',
      approach: 'approach',
      currentRecordType: 'ITEM',
      processedFileName: 'file.csv',
      initialFileName: 'initial.csv',
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: true,
      countOfRecords: 10,
    });
    renderBulkEditIdentifiers({ bulkDetails: { fqlQuery: null } });
    expect(screen.getByText('ui-bulk-edit.meta.title.uploadedFile')).toBeInTheDocument();
  });

  it('renders marc uploaded file title when in identifier criteria, file name exists and approach is MARC', () => {
    useSearchParams.mockReturnValue({
      step: 'step',
      approach: APPROACHES.MARC,
      currentRecordType: 'ITEM',
      processedFileName: 'file.mrc',
      initialFileName: 'initial.mrc',
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: true,
      countOfRecords: 10,
    });
    renderBulkEditIdentifiers({ bulkDetails: { fqlQuery: null } });
    expect(screen.getByText('ui-bulk-edit.meta.title.uploadedFile.marc')).toBeInTheDocument();
  });

  it('renders matched subtitle when step is UPLOAD', () => {
    useSearchParams.mockReturnValue({
      step: EDITING_STEPS.UPLOAD,
      approach: 'approach',
      currentRecordType: 'ITEM',
      processedFileName: 'file.csv',
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: true,
      countOfRecords: 10,
    });
    renderBulkEditIdentifiers({ bulkDetails: { fqlQuery: null } });
    expect(screen.getByText('ui-bulk-edit.list.logSubTitle.matched')).toBeInTheDocument();
  });

  it('renders changed subtitle when step is not UPLOAD', () => {
    useSearchParams.mockReturnValue({
      step: EDITING_STEPS.COMMIT,
      approach: 'approach',
      currentRecordType: 'ITEM',
      processedFileName: 'file.csv',
    });
    getBulkOperationStatsByStep.mockReturnValue({
      isOperationInPreviewStatus: true,
      countOfRecords: 10,
    });
    renderBulkEditIdentifiers({ bulkDetails: { fqlQuery: null } });
    expect(screen.getByText('ui-bulk-edit.list.logSubTitle.changed')).toBeInTheDocument();
  });
});
