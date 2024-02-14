import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { runAxeTest } from '@folio/stripes-testing';
import { ElectronicAccessTable } from './ElectronicAccessTable';


const testValue = 'https://search.proquest.com/publication/1396348\u001f;test\u001f;1.2012 -\u001f;via ProQuest, the last 12 months are not available due to an embargo\u001f;Resource';
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
    const tableBodyRows = testValue.split('\u001f|').map(row => row.split('\u001f;'));

    tableBodyRows.forEach(row => {
      row.forEach(cell => {
        expect(getByText(cell)).toBeInTheDocument();
      });
    });
  });

  it('should render with no axe errors', async () => {
    render(<ElectronicAccessTable value={testValue} />);

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
