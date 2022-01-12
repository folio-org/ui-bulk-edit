import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../../test/jest/__mock__';

import { Preview } from './Preview';

jest.mock('./PreviewAccordion', () => ({
  PreviewAccordion: () => 'PreviewAccordion',
}));

const renderPreview = () => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1?queryText=%28patronGroup%3D%3D"1"']}>
      <Preview />
    </MemoryRouter>,
  );
};

describe('Preview', () => {
  it('displays Bulk edit', () => {
    renderPreview();

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
    expect(screen.getByText('PreviewAccordion')).toBeVisible();
  });
});
