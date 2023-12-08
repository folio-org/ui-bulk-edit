import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ElectronicAccessTable } from './ElectronicAccessTable';


const testValue = 'https://search.proquest.com/publication/1396348;test;1.2012 -;via ProQuest, the last 12 months are not available due to an embargo;Resource';
describe('ElectronicAccessTable', () => {
  it('renders table headers correctly', () => {
    const { getByText } = render(<ElectronicAccessTable value={testValue} />);
    [
      'ui-bulk-edit.list.preview.electronicAccess.relationship',
      'ui-bulk-edit.list.preview.electronicAccess.uri',
      'ui-bulk-edit.list.preview.electronicAccess.linkText',
      'ui-bulk-edit.list.preview.electronicAccess.materialsSpecified',
      'ui-bulk-edit.list.preview.electronicAccess.publicNote',
    ].forEach(header => {
      expect(getByText(header)).toBeInTheDocument();
    });
  });

  it('renders table body rows correctly', () => {
    const { getByText } = render(<ElectronicAccessTable value={testValue} />);
    const tableBodyRows = testValue.split('|').map(row => row.split(';'));

    tableBodyRows.forEach(row => {
      row.forEach(cell => {
        expect(getByText(cell)).toBeInTheDocument();
      });
    });
  });
});
