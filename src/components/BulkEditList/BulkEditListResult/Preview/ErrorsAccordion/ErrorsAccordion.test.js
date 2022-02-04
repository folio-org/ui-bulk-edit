import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';

import ErrorsAccordion from './ErrorsAccordion';

jest.mock('../../../../../API', () => ({
  usePreviewRecords: () => ({ users: [
    {
      username: 'username',
      active: true,
      barcode: '789',
      createdDate: 1641779462295,
    },
    {
      username: 'user',
      active: false,
      barcode: '123',
    },
  ] }),
}));

const renderPreviewAccordion = () => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1']}>
      <ErrorsAccordion />
    </MemoryRouter>,
  );
};

describe('PreviewAccordion', () => {
  it('should render preview accordion', () => {
    renderPreviewAccordion();

    expect(screen.getByText('username'));
  });
});
