import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../../test/jest/__mock__';

import PreviewAccordion from './PreviewAccordion';

jest.mock('../../../../../API', () => ({
  usePreviewRecords: () => ({ users: [{ username: 'username' }] }),
}));

const renderPreviewAccordion = () => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1?selectedColumns=%5B"username"%5D']}>
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
