import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import '../test/jest/__mock__';

import BulkEdit from './BulkEdit';

const renderBulkEdit = () => {
  window.history.pushState({}, 'Test page', '/bulk-edit');

  render(
    <BrowserRouter>
      <BulkEdit />
    </BrowserRouter>,
  );
};

describe('BulkEdit', () => {
  it('displays Bulk edit', () => {
    renderBulkEdit();

    expect(screen.getByText(/meta.title/)).toBeVisible();
  });

  it('should display correct pane titles', () => {
    renderBulkEdit();

    expect(screen.getByText(/list.logSubTitle/)).toBeVisible();
    expect(screen.getByText(/list.criteriaTitle/)).toBeVisible();
  });

  it('should display empty result list', () => {
    renderBulkEdit();

    expect(screen.getByText(/list.result.emptyMessage/)).toBeVisible();
  });

  it('should display option buttons', () => {
    renderBulkEdit();

    expect(screen.getByRole('button', { name: /list.filters.identifier/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /list.filters.query/ })).toBeEnabled();
  });


  it('should change active filter criteria ', () => {
    renderBulkEdit();

    const queryButton = screen.getByRole('button', { name: /list.filters.query/ });
    const identifierButton = screen.getByRole('button', { name: /list.filters.identifier/ });

    userEvent.click(queryButton);

    expect(queryButton).toHaveAttribute('class', 'button primary');

    userEvent.click(identifierButton);

    expect(identifierButton).toHaveAttribute('class', 'button primary');
  });
});
