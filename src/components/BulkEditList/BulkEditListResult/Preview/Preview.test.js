import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';

import { render, screen } from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';
import { IntlProvider } from 'react-intl';
import { bulkEditLogsData } from '../../../../../test/jest/__mock__/fakeData';
import { queryClient } from '../../../../../test/jest/utils/queryClient';

import { RootContext } from '../../../../context/RootContext';
import { Preview } from './Preview';

jest.mock('./PreviewAccordion', () => ({
  PreviewAccordion: () => 'PreviewAccordion',
}));

const bulkOperation = bulkEditLogsData[0];
const setCountOfRecordsMock = jest.fn();

const defaultProps = {
  title: 'preview.query.title',
  initial: false,
  bulkDetails: bulkOperation,
  id: bulkOperation.id,
};

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  formatNumber: jest.fn()
}));

const renderPreview = (props = defaultProps) => {
  render(
    <IntlProvider locale="en">
      <MemoryRouter initialEntries={['/bulk-edit/1?queryText=patronGroup%3D%3D"1"']}>
        <QueryClientProvider client={queryClient}>
          <RootContext.Provider value={{ setCountOfRecords: setCountOfRecordsMock }}>
            <Preview {...props} />
          </RootContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>,
    </IntlProvider>
  );
};

describe('Preview', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => {},
        }),
      });
  });

  it('displays Bulk edit', () => {
    renderPreview();

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
  });

  it('displays Bulk edit', () => {
    renderPreview({ ...defaultProps, initial: true });

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
  });
});

describe('Preview Query', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => {},
        }),
      });
  });

  it('displays Bulk edit', () => {
    renderPreview();

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    renderPreview();

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
