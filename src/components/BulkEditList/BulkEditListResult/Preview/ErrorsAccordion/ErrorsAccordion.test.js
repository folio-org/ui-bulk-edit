import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';
import userEvent from '@testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';
import { errorsPreview } from '../../../../../../test/jest/__mock__/fakeData';

import ErrorsAccordion from './ErrorsAccordion';

const defaultProps = {
  errors: errorsPreview.errors,
  entries: 5,
  countOfErrors: errorsPreview.errors.length,
  matched: 4,
};

const renderPreviewAccordion = (history, props = defaultProps) => {
  return render(
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

  it('should render with no axe errors', async () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    renderPreviewAccordion(mockHistory, { ...defaultProps, initial: true });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render preview accordion', () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    renderPreviewAccordion(mockHistory, { ...defaultProps, initial: false });

    expect(screen.getByText(/errors.infoProcessed/)).toBeVisible();
    expect(screen.getByText(/errors.table.code/)).toBeVisible();
    expect(screen.getByText(errorsPreview.errors[0].message)).toBeVisible();
  });

  it('should hide content when title was clicked', () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    const { getByRole } = renderPreviewAccordion(mockHistory, { ...defaultProps, initial: false });

    expect(screen.getByText(/errors.infoProcessed/)).toBeVisible();

    const titleButton = getByRole('button', { name: /ui-bulk-edit.list.errors.title/ });

    userEvent.click(titleButton);

    waitFor(() => {
      expect(screen.getByText(/errors.infoProcessed/)).not.toBeVisible();
    });
  });
});
