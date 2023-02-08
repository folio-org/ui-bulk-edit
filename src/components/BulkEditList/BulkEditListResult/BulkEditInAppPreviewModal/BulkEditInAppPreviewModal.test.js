import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';

import { render, screen, fireEvent } from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import '../../../../../test/jest/__mock__';
import { bulkEditLogsData } from '../../../../../test/jest/__mock__/fakeData';
import { queryClient } from '../../../../../test/jest/utils/queryClient';
import { RootContext } from '../../../../context/RootContext';

import {
  useBulkOperationDetails,
} from '../../../../hooks/api';
import BulkEditInAppPreviewModal from './BulkEditInAppPreviewModal';

jest.mock('../../../../hooks/api', () => ({
  ...jest.requireActual('../../../../hooks/api'),
  useBulkOperationDetails: jest.fn(),
}));

const bulkOperation = bulkEditLogsData[0];
const visibleColumns = [];
const onKeepEditing = jest.fn();
const onJobStarted = jest.fn();
const setUpdatedId = jest.fn();

const defaultProps = {
  open: true,
  bulkOperationId: bulkOperation.id.toString(),
  onKeepEditing,
  onJobStarted,
  setUpdatedId,
};

const renderPreviewModal = (props = defaultProps) => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1/initial?capabilities=ITEMS&fileName=barcodes.csv&identifier=BARCODE']}>
      <QueryClientProvider client={queryClient}>
        <RootContext.Provider value={{
          visibleColumns,
        }}
        >
          <BulkEditInAppPreviewModal {...props} />
        </RootContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe('BulkEditInAppPreviewModal', () => {
  beforeEach(() => {
    useBulkOperationDetails.mockClear().mockReturnValue(() => ({
      bulkDetails: bulkOperation,
    }));

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ([]),
        }),
        post: () => ({
          json: () => ({}),
        }),
      });
  });

  it('should call all footer handlers', async () => {
    renderPreviewModal();

    fireEvent.click(screen.getByText('ui-bulk-edit.previewModal.keepEditing'));
    expect(onKeepEditing).toHaveBeenCalled();
  });
});
