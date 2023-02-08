import React from 'react';
import {
  act,
  screen,
  render,
  fireEvent,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import ListFileUploader from './ListFileUploader';
import { createDtWithFiles, createFile, dispatchEvt, flushPromises, mockData } from '../../../test/jest/utils/fileUpload';

const onDragEnterMock = jest.fn();
const onDragLeaveMock = jest.fn();
const onDropMock = jest.fn();

const renderListFileUploader = ({
  isDropZoneActive = false,
  isLoading = false,
  recordIdentifier = '',
  isDropZoneDisabled = false,
  uploaderSubTitle = 'uploaderSubTitle',
}) => {
  render(
    <ListFileUploader
      className="FileUploader"
      handleDragEnter={onDragEnterMock}
      handleDragLeave={onDragLeaveMock}
      handleDrop={onDropMock}
      isDropZoneActive={isDropZoneActive}
      isLoading={isLoading}
      recordIdentifier={recordIdentifier}
      disabled={isDropZoneDisabled}
      uploaderSubTitle={uploaderSubTitle}
    />,
  );
};


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
    expect(document.querySelector('[data-test-upload-btn]')).toBeEnabled();
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

    await act(() => {
      dispatchEvt(fileInput, 'dragenter', data);

      return flushPromises();
    });

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

    await act(() => {
      dispatchEvt(fileInput, 'dragenter', data);

      return flushPromises();
    });

    expect(onDragEnterMock).toHaveBeenCalled();

    await act(() => {
      fireEvent.drop(fileInput, event);

      return flushPromises();
    });

    expect(onDropMock).toHaveBeenCalled();
  });
});
