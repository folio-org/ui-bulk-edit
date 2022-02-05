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

const renderPreviewAccordion = () => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1']}>
      <ErrorsAccordion errors={errors} />
    </MemoryRouter>,
  );
};

describe('PreviewAccordion', () => {
  it('should render preview accordion', () => {
    renderPreviewAccordion();

    expect(screen.getByText('code')).toBeVisible();
    expect(screen.getByText('error')).toBeVisible();
  });
});
