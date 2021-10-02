import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import BulckEdit from './BulckEdit';

const renderBulckEdit = () => {
  window.history.pushState({}, 'Test page', '/bulck-edit');

  render(
    <BrowserRouter>
      <BulckEdit />
    </BrowserRouter>,
  );
};

describe('BulckEdit', () => {
  it('displays Bulck edit', () => {
    renderBulckEdit();

    expect(screen.getByText('Bulck Edit')).toBeVisible();
  });
});
