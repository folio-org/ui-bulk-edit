import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import BulkEdit from './BulkEdit';

const renderBulkEdit = () => {
  window.history.pushState({}, 'Test page', '/bulk-edit');

  render(
    <BrowserRouter>
      <BulkEdit />
    </BrowserRouter>,
  );
};

function mockData(files) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
}

function createDtWithFiles(files = []) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
}

function createFile(name, size, type) {
  const file = new File([], name, { type });
  Object.defineProperty(file, 'size', {
    get() {
      return size;
    },
  });
  return file;
}

function flushPromises(container) {
  return new Promise(resolve => setImmediate(() => {
    resolve(container);
  }));
}

function dispatchEvt(node, type, data) {
  const event = new Event(type, { bubbles: true });

  Object.assign(event, data);
  fireEvent(node, event);
}

describe('BulkEdit', () => {
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

    expect(screen.getByText(/list.result.emptyMessage/)).toBeVisible();
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

    userEvent.click(queryButton);

    expect(queryButton).toHaveAttribute('class', 'button primary');

    userEvent.click(identifierButton);

    expect(identifierButton).toHaveAttribute('class', 'button primary');
  });

  it('should display select', () => {
    renderBulkEdit();

    expect(screen.getByRole('combobox', { name: 'ui-bulk-edit.list.filters.recordIdentifier' })).toBeEnabled();
  });

  it('should display select right select options', () => {
    renderBulkEdit();

    const options = [
      /filters.recordIdentifier.placeholder/,
      /filters.recordIdentifier.userUUIDs/,
      /filters.recordIdentifier.userBarcodes/,
      /filters.recordIdentifier.externalIDs/,
      /filters.recordIdentifier.usernames/,
    ];

    const userUUIDs = screen.getByRole('option', { name: /filters.recordIdentifier.userUUIDs/ });

    const selectRecordIdentifier = screen.getByRole('combobox');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    userEvent.selectOptions(
      selectRecordIdentifier,
      userUUIDs,
    );

    expect(userUUIDs.selected).toBe(true);
  });

  it('should trigger the drag and drop', async () => {
    const file = new File([
      JSON.stringify({ ping: true }),
    ], 'ping.json', { type: 'application/json' });
    const data = mockData([file]);

    renderBulkEdit();

    const fileInput = screen.getByTestId('fileUploader-input');

    dispatchEvt(fileInput, 'dragenter', data);
  });

  it('should display capability accordion with right options', () => {
    renderBulkEdit();

    const enabledOption = screen.getByRole('checkbox', { name: /capabilities.users/ });

    const disabledOptions = [
      /filters.capabilities.inventory/,
      /filters.capabilities.circulation/,
      /filters.capabilities.acquisition/,
    ];

    disabledOptions.forEach((el) => expect(screen.getByRole('checkbox', { name: el })).toBeDisabled());

    expect(enabledOption).toBeEnabled();
  });

  it('should display unchecked option', () => {
    renderBulkEdit();

    const enabledOption = screen.getByRole('checkbox', { name: /capabilities.users/ });

    userEvent.click(enabledOption);

    expect(enabledOption).not.toBeChecked();
  });

  it('should display Saved queries', () => {
    renderBulkEdit();

    expect(screen.getByRole('button', { name: /Icon ui-bulk-edit.list.savedQueries.title/ })).toBeEnabled();
  });

  it('should update title with uploaded name', async () => {
    const file = [createFile('SearchHoldings.csv', 1111, 'application/csv')];

    const event = createDtWithFiles(file);
    const data = mockData([file]);

    renderBulkEdit();

    const fileInput = screen.getByTestId('fileUploader-input');

    dispatchEvt(fileInput, 'dragenter', data);
    await flushPromises();

    fireEvent.drop(fileInput, event);
    await flushPromises();

    expect(screen.getByText(/meta.title.uploadedFile/)).toBeVisible();
  });
});
