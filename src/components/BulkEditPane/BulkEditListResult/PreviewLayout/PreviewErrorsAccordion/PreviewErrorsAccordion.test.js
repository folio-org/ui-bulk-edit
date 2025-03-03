import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';
import userEvent from '@testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';
import { errorsPreview } from '../../../../../../test/jest/__mock__/fakeData';

import { PreviewErrorsAccordion } from './PreviewErrorsAccordion';

const defaultProps = {
  errors: errorsPreview.errors,
  countOfErrors: errorsPreview.errors.length,
};

const renderPreviewAccordion = (history, props = defaultProps) => {
  return render(
    <MemoryRouter initialEntries={history}>
      <PreviewErrorsAccordion {...props} />
    </MemoryRouter>,
  );
};

describe('ErrorsAccordion', () => {
  it('should render preview accordion', () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    renderPreviewAccordion(mockHistory, { ...defaultProps });

    expect(screen.getByText(/errors.info/)).toBeVisible();
    expect(screen.getByText(/errors.table.code/)).toBeVisible();
    expect(screen.getByText(errorsPreview.errors[0].message)).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    renderPreviewAccordion(mockHistory, { ...defaultProps });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render preview accordion', () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    renderPreviewAccordion(mockHistory, { ...defaultProps });

    expect(screen.getByText(/errors.table.code/)).toBeVisible();
    expect(screen.getByText(errorsPreview.errors[0].message)).toBeVisible();
  });

  it('should hide content when title was clicked', () => {
    const mockHistory = ['/bulk-edit/1/preview'];

    const { getByRole } = renderPreviewAccordion(mockHistory, { ...defaultProps });

    expect(screen.getByText(/list.errors.info/)).toBeVisible();

    const titleButton = getByRole('button', { name: /ui-bulk-edit.list.errors.title/ });

    userEvent.click(titleButton);

    waitFor(() => {
      expect(screen.getByText(/list.errors.info/)).not.toBeVisible();
    });
  });
});
