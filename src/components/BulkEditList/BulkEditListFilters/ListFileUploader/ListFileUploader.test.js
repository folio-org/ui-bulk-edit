import React from 'react';
import {
  screen, render, fireEvent,
} from '@testing-library/react';

import '../../../../../test/jest/__mock__';

import { ListFileUploader } from './ListFileUploader';

const onDragEnterMock = jest.fn();
const onDragLeaveMock = jest.fn();
const onDropMock = jest.fn();
const hideFileExtensionModalMock = jest.fn();

const renderListFileUploader = (isDropZoneActive = false, isLoading = false) => {
  render(
    <ListFileUploader
      handleDragEnter={onDragEnterMock}
      handleDragLeave={onDragLeaveMock}
      handleDrop={onDropMock}
      isDropZoneActive={isDropZoneActive}
      hideFileExtensionModal={hideFileExtensionModalMock}
      isLoading={isLoading}
      fileExtensionModalOpen={false}
    />,
  );
};

function flushPromises(container) {
  return new Promise(resolve => setImmediate(() => {
    renderListFileUploader();
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
    renderListFileUploader();

    expect(screen.getByText(/uploaderTitle/)).toBeVisible();
    expect(screen.getByText(/uploaderSubTitle/)).toBeVisible();
    expect(screen.getByRole('button', { name: /uploaderBtnText/ })).toBeEnabled();
  });

  it('should display FileUploader with loading state', () => {
    renderListFileUploader(true, true);

    expect(screen.getByText(/uploading/)).toBeEnabled();
  });

  it('should display FileUploader without loading state', () => {
    renderListFileUploader(true, false);

    expect(screen.getByText(/uploaderActiveTitle/)).toBeEnabled();
  });

  it('should call callback on drag enter', async () => {
    const file = new File([
      JSON.stringify({ ping: true }),
    ], 'ping.json', { type: 'application/json' });
    const data = mockData([file]);

    renderListFileUploader();

    const fileInput = screen.getByTestId('fileUploader-input');

    dispatchEvt(fileInput, 'dragenter', data);
    await flushPromises();

    expect(onDragEnterMock).toHaveBeenCalled();
  });
});
