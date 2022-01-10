import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';

import PreviewAccordion from './PreviewAccordion';

jest.mock('../../../../../API', () => ({
  usePreviewRecords: () => ({ users: [
    {
      username: 'username',
      active: true,
      barcode: '789',
      createdDate: 1641779462295,
    },
  ] }),
}));

const renderPreviewAccordion = () => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1']}>
      <PreviewAccordion />
    </MemoryRouter>,
  );
};

describe('PreviewAccordion', () => {
  it('should render preview accordion', () => {
    renderPreviewAccordion();

    expect(screen.getByText('username'));
  });
});
