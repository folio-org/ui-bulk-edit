import { render } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { EmbeddedTable } from './EmbeddedTable';
import {
  CLASSIFICATION_HEAD_TITLES,
  ELECTRONIC_ACCESS_HEAD_TITLES,
  SUBJECT_HEAD_TITLES
} from '../../../../PermissionsModal/constants/lists';


const electronicAccessValue = 'https://search.proquest.com/publication/1396348\u001f;test\u001f;1.2012 -\u001f;via ProQuest, the last 12 months are not available due to an embargo\u001f;Resource';
const subjectValue = 'head\u001f;source\u001f;title';
const classificationValue = 'identifierType\u001f;classification';


describe('EmbeddedTable', () => {
  describe('Electronic access table', () => {
    it('renders table headers correctly', () => {
      const { getByText } = render(<EmbeddedTable value={electronicAccessValue} headTitles={ELECTRONIC_ACCESS_HEAD_TITLES} />);
      [
        'ui-bulk-edit.list.preview.electronicAccess.relationship',
        'ui-bulk-edit.list.preview.electronicAccess.uri',
        'ui-bulk-edit.list.preview.electronicAccess.linkText',
        'ui-bulk-edit.list.preview.electronicAccess.materialsSpecified',
        'ui-bulk-edit.list.preview.electronicAccess.publicNote',
      ].forEach(header => {
        expect(getByText(header))
          .toBeInTheDocument();
      });
    });

    it('renders table body rows correctly', () => {
      const { getByText } = render(<EmbeddedTable value={electronicAccessValue} headTitles={ELECTRONIC_ACCESS_HEAD_TITLES} />);
      const tableBodyRows = electronicAccessValue.split('\u001f|')
        .map(row => row.split('\u001f;'));

      tableBodyRows.forEach(row => {
        row.forEach(cell => {
          expect(getByText(cell))
            .toBeInTheDocument();
        });
      });
    });
  });

  describe('Subject table', () => {
    it('renders table headers correctly', () => {
      const { getByText } = render(<EmbeddedTable value={subjectValue} headTitles={SUBJECT_HEAD_TITLES} />);
      [
        'ui-bulk-edit.list.preview.subject.subjectHeadings',
        'ui-bulk-edit.list.preview.subject.subjectSource',
        'ui-bulk-edit.list.preview.subject.subjectType',
      ].forEach(header => {
        expect(getByText(header))
          .toBeInTheDocument();
      });
    });

    it('renders table body rows correctly', () => {
      const { getByText } = render(<EmbeddedTable value={subjectValue} headTitles={SUBJECT_HEAD_TITLES} />);
      const tableBodyRows = subjectValue.split('\u001f|')
        .map(row => row.split('\u001f;'));

      tableBodyRows.forEach(row => {
        row.forEach(cell => {
          expect(getByText(cell))
            .toBeInTheDocument();
        });
      });
    });
  });

  describe('Classification table', () => {
    it('renders table headers correctly', () => {
      const { getByText } = render(<EmbeddedTable value={classificationValue} headTitles={CLASSIFICATION_HEAD_TITLES} />);
      [
        'ui-bulk-edit.list.preview.classification.identifierType',
        'ui-bulk-edit.list.preview.classification.classification',
      ].forEach(header => {
        expect(getByText(header))
          .toBeInTheDocument();
      });
    });

    it('renders table body rows correctly', () => {
      const { getByText } = render(<EmbeddedTable value={classificationValue} headTitles={CLASSIFICATION_HEAD_TITLES} />);
      const tableBodyRows = classificationValue.split('\u001f|')
        .map(row => row.split('\u001f;'));

      tableBodyRows.forEach(row => {
        row.forEach(cell => {
          expect(getByText(cell))
            .toBeInTheDocument();
        });
      });
    });
  });

  it('should render with no axe errors', async () => {
    render(<EmbeddedTable value={electronicAccessValue} headTitles={ELECTRONIC_ACCESS_HEAD_TITLES} />);

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
