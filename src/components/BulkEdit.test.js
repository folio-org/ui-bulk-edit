import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';

import '../../test/jest/__mock__';

import BulkEdit from './BulkEdit';
import { mockData, createDtWithFiles, createFile, flushPromises, dispatchEvt } from '../../test/jest/utils/fileUpload';
import { queryClient } from '../../test/jest/utils/queryClient';

jest.mock('./BulkEditList/BulkEditListResult', () => ({
  BulkEditListResult: () => 'BulkEditListResult',
}));

const history = createMemoryHistory();

const renderBulkEdit = (type = 'USERS') => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/bulk-edit?capabilities=${type}&identifier=BARCODE&criteria=identifier`]}>
        <BulkEdit />
      </MemoryRouter>,
    </QueryClientProvider>,
  );
};

describe('BulkEdit', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        post: () => ({
          json: () => ({
            id: '1',
          }),
        }),
      });
  });

  it('displays Bulk edit', () => {
    renderBulkEdit();

    expect(screen.getByText(/meta.title/)).toBeVisible();
  });

  it('should display correct pane titles', () => {
    renderBulkEdit();

    expect(screen.getByText(/list.logSubTitle/)).toBeVisible();
    expect(screen.getByText(/list.criteriaTitle/)).toBeVisible();
  });

  it('should display empty result list', () => {
    renderBulkEdit();

    expect(screen.getByText(/BulkEditListResult/)).toBeVisible();
  });

  // This test will be passing after fixing problem in stripes-data-transfer-components
  it('should render with no axe errors', async () => {
    renderBulkEdit();

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should display option buttons', () => {
    renderBulkEdit();

    expect(screen.getByRole('button', { name: /list.filters.identifier/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /list.filters.query/ })).toBeEnabled();
  });


  it('should change active filter criteria ', () => {
    renderBulkEdit();

    const queryButton = screen.getByRole('button', { name: /list.filters.query/ });
    const identifierButton = screen.getByRole('button', { name: /list.filters.identifier/ });

    act(() => {
      userEvent.click(queryButton);
    });

    expect(queryButton).toHaveAttribute('class', 'button primary');

    act(() => {
      userEvent.click(identifierButton);
    });

    expect(identifierButton).toHaveAttribute('class', 'button primary');
  });

  it('should display select', () => {
    renderBulkEdit();

    expect(screen.getByRole('combobox', { name: 'ui-bulk-edit.list.filters.recordIdentifier' })).not.toBeEnabled();
  });

  it('should display select right select options on inventory tab', () => {
    renderBulkEdit();

    act(() => {
      userEvent.click(screen.getByRole('radio', { name: /filters.capabilities.inventory/ }));
    });

    const options = [
      /filters.recordIdentifier.item.barcode/,
      /filters.recordIdentifier.item.UUID/,
      /filters.recordIdentifier.item.ItemHRIDs/,
      /filters.recordIdentifier.item.former/,
      /filters.recordIdentifier.item.accession/,
      /filters.recordIdentifier.item.holdingsUUID/,
    ];

    const itemFormer = screen.getByRole('option', { name: /filters.recordIdentifier.item.former/ });

    const selectRecordIdentifier = screen.getByRole('combobox');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    act(() => userEvent.selectOptions(
      selectRecordIdentifier,
      itemFormer,
    ));

    expect(itemFormer.selected).toBe(true);
  });

  it('should trigger the drag and drop', async () => {
    const file = new File([
      JSON.stringify({ ping: true }),
    ], 'ping.json', { type: 'application/json' });
    const data = mockData([file]);

    renderBulkEdit();

    const fileInput = screen.getByTestId('fileUploader-input');

    await act(() => {
      dispatchEvt(fileInput, 'dragenter', data);
      return flushPromises();
    });
  });

  it('should update title with uploaded name and call startJob in case of ITEM capability', async () => {
    const file = [createFile('SearchHoldings.csv', 1111, 'text/csv')];

    const event = createDtWithFiles(file);
    const data = mockData([file]);

    renderBulkEdit('ITEMS');

    const fileInput = screen.getByTestId('fileUploader-input');

    await act(() => {
      dispatchEvt(fileInput, 'dragenter', data);
      return flushPromises();
    });

    await act(() => {
      fireEvent.drop(fileInput, event);
      return flushPromises();
    });

    history.push({
      pathname: 'bulk-edit/1',
    });

    expect(screen.getByText(/meta.title/)).toBeVisible();
  });

  it('should update unsupported type of file', async () => {
    const file = [createFile('SearchHoldings.pdf', 1111, 'application/pdf')];

    const event = createDtWithFiles(file);
    const data = mockData([file]);

    renderBulkEdit();

    const fileInput = screen.getByTestId('fileUploader-input');

    await act(() => {
      dispatchEvt(fileInput, 'dragenter', data);
      return flushPromises();
    });

    await act(() => {
      fireEvent.drop(fileInput, event);
      return flushPromises();
    });
  });

  describe('Should show expected messages if files are not valid', () => {
    const setupTest = async (files) => {
      renderBulkEdit();

      const fileInput = screen.getByTestId('fileUploader-input');

      const file = [...files];

      const event = createDtWithFiles(file);
      const data = mockData([file]);

      act(() => {
        dispatchEvt(fileInput, 'dragenter', data);
        fireEvent.drop(fileInput, event);
      });

      await waitFor(() => expect(screen.getByText('ui-bulk-edit.uploaderBtnText')).toBeEnabled());
    };

    it('should show modal when file is unsupported', async () => {
      await setupTest(
        [createFile('SearchHoldings.pdf', 1111, 'application/pdf')],
      );
    });

    it('should show modal when files count > 1', async () => {
      await setupTest(
        [
          createFile('SearchHoldings.pdf', 1111, 'application/pdf'),
          createFile('SearchHoldings2.pdf', 2222, 'application/pdf'),
        ],
      );
    });
  });
});
