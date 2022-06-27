import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';

import ErrorsAccordion from './ErrorsAccordion';

const errors = [
  {
    code: 'code',
    message: 'error',
    parameters: null,
    type: 'BULK_EDIT_ERROR',
  },
];

const renderPreviewAccordion = (history) => {
  render(
    <MemoryRouter initialEntries={history}>
      <ErrorsAccordion errors={errors} entries={5} countOfErrors={1} matched={4} />
    </MemoryRouter>,
  );
};

describe('PreviewAccordion', () => {
  it('should render preview accordion', () => {
    const mockHistory = ['/bulk-edit/1/initial'];
    renderPreviewAccordion(mockHistory);

    expect(screen.getByText(/errors.info/)).toBeVisible();
    expect(screen.getByText(/errors.table.code/)).toBeVisible();
    expect(screen.getByText('error')).toBeVisible();
  });

  it('should render preview accordion', () => {
    const mockHistory = ['/bulk-edit/1/processed'];
    renderPreviewAccordion(mockHistory);

    expect(screen.getByText(/errors.infoProccessed/)).toBeVisible();
    expect(screen.getByText(/errors.table.code/)).toBeVisible();
    expect(screen.getByText('error')).toBeVisible();
  });
});
