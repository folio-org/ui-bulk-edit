import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';
import { errorsPreview } from '../../../../../../test/jest/__mock__/fakeData';

import ErrorsAccordion from './ErrorsAccordion';

const defaultProps = {
  errors: errorsPreview.errors,
  entries: 5,
  countOfErrors: errorsPreview.errors.length,
  matched: 4,
};

const renderPreviewAccordion = (history, props = defaultProps) => {
  render(
    <MemoryRouter initialEntries={history}>
      <ErrorsAccordion {...props} />
    </MemoryRouter>,
  );
};

describe('ErrorsAccordion', () => {
  it('should render preview accordion', () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    renderPreviewAccordion(mockHistory, { ...defaultProps, initial: true });

    expect(screen.getByText(/errors.info/)).toBeVisible();
    expect(screen.getByText(/errors.table.code/)).toBeVisible();
    expect(screen.getByText(errorsPreview.errors[0].message)).toBeVisible();
  });

  it('should render preview accordion', () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    renderPreviewAccordion(mockHistory, { ...defaultProps, initial: false });

    expect(screen.getByText(/errors.infoProcessed/)).toBeVisible();
    expect(screen.getByText(/errors.table.code/)).toBeVisible();
    expect(screen.getByText(errorsPreview.errors[0].message)).toBeVisible();
  });
});
