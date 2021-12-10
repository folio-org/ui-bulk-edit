import { render, screen } from '@testing-library/react';

import '../../../../../test/jest/__mock__';

import { Preview } from './Preview';

const renderPreview = () => {
  render(
    <Preview fileUploadedName="Mock.csv" />,
  );
};

describe('Preview', () => {
  it('displays Bulk edit', () => {
    renderPreview();

    expect(screen.getByText('FileName: Mock.csv')).toBeVisible();
  });
});
