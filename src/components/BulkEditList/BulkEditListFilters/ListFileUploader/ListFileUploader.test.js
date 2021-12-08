import React from 'react';
import {
  screen,
  render,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../../test/jest/__mock__';

import { ListFileUploader } from './ListFileUploader';

const onDragEnterMock = jest.fn();
const onDragLeaveMock = jest.fn();
const onDropMock = jest.fn();
const hideFileExtensionModalMock = jest.fn();

const renderListFileUploader = ({
  isDropZoneActive = false,
  isLoading = false,
  recordIdentifier = '',
  isDropZoneDisabled = false,
  fileExtensionModalOpen = false,
}) => {
  render(
    <ListFileUploader
      handleDragEnter={onDragEnterMock}
      handleDragLeave={onDragLeaveMock}
      handleDrop={onDropMock}
      isDropZoneActive={isDropZoneActive}
      hideFileExtensionModal={hideFileExtensionModalMock}
      isLoading={isLoading}
      fileExtensionModalOpen={fileExtensionModalOpen}
      recordIdentifier={recordIdentifier}
      disabled={isDropZoneDisabled}
    />,
  );
};

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

describe('FileUploader', () => {
  afterEach(() => jest.clearAllMocks());
  it('should display FileUploader', () => {
    renderListFileUploader(
      {
        isDropZoneActive: false,
      },
    );

    expect(screen.getByText(/uploaderTitle/)).toBeVisible();
    expect(screen.getByText(/uploaderSubTitle/)).toBeVisible();
    expect(screen.getByRole('button', { name: /uploaderBtnText/ })).toBeDisabled();
  });

  it('should display FileUploader with loading state', () => {
    renderListFileUploader(
      {
        isDropZoneActive: true,
        isLoading: true,
      },
    );

    expect(screen.getByText(/uploading/)).toBeEnabled();
  });

  it('should display FileUploader without loading state', () => {
    renderListFileUploader({
      isDropZoneActive: true,
      isLoading: false,
    });

    expect(screen.getByText(/uploaderActiveTitle/)).toBeEnabled();
  });

  it('should call callback on drag enter', async () => {
    const file = new File([
      JSON.stringify({ ping: true }),
    ], 'ping.json', { type: 'application/json' });
    const data = mockData([file]);

    renderListFileUploader(
      {
        isDropZoneActive: false,
      },
    );

    const fileInput = screen.getByTestId('fileUploader-input');

    dispatchEvt(fileInput, 'dragenter', data);
    await flushPromises();

    expect(onDragEnterMock).toHaveBeenCalled();
  });

  it('should call onDrop', async () => {
    const file = [createFile('file1.pdf', 1111, 'application/pdf')];

    const event = createDtWithFiles(file);
    const data = mockData([file]);

    renderListFileUploader(
      {
        isDropZoneActive: false,
      },
    );

    const fileInput = screen.getByTestId('fileUploader-input');

    dispatchEvt(fileInput, 'dragenter', data);
    await flushPromises();

    expect(onDragEnterMock).toHaveBeenCalled();

    fireEvent.drop(fileInput, event);
    await flushPromises();

    expect(onDropMock).toHaveBeenCalled();
  });

  it('should display FileUploader modal', () => {
    renderListFileUploader({
      isDropZoneActive: true,
      isLoading: false,
      fileExtensionModalOpen: true,
    });

    const modalText = [
      /modal.fileExtensions.blocked.header/,
      /modal.fileExtensions.blocked.message/,
    ];

    modalText.forEach((el) => expect(screen.getByText(el)).toBeVisible());

    userEvent.click(screen.getByRole('button', { name: /fileExtensions.actionButton/ }));

    expect(hideFileExtensionModalMock).toHaveBeenCalled();
  });
});
