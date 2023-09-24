import React from 'react';
import { render } from '@testing-library/react';
import { FormattedNotes } from './FormattedNotes';

describe('FormattedNotes', () => {
  const notes = "Note;Missing pages; p 10-13;false|Action note;My action note;false";

  it('renders nothing when notes prop is not provided', () => {
    const { container } = render(<FormattedNotes />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a table with the correct structure when notes are provided', () => {
    const { getByText } = render(<FormattedNotes notes={notes} />);

    expect(getByText('Note')).toBeInTheDocument();
    expect(getByText('Missing pages; p 10-13')).toBeInTheDocument();
    expect(getByText('Action note')).toBeInTheDocument();
    expect(getByText('My action note')).toBeInTheDocument();
  });

  it('ignores content specified in ignoredContent array', () => {
    const { queryByText } = render(<FormattedNotes notes={notes} />);

    expect(queryByText('false')).toBeNull();
  });

  it('renders a table with the correct number of rows', () => {
    const { container } = render(<FormattedNotes notes={notes} />);

    const headRows = container.querySelectorAll('thead tr');
    const rows = container.querySelectorAll('tbody tr');

    expect(headRows.length).toBe(1);
    expect(rows.length).toBe(1);
  });
});
