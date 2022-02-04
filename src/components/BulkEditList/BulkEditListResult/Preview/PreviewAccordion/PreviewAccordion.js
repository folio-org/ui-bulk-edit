import { useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import { DEFAULT_COLUMNS } from '../../../../../constants';
import { FormattedTime } from './FormattedTime';

const resultsFormatter = {
  active: user => (
    <AppIcon app="users" size="small">
      {
      user.active
        ? <FormattedMessage id="ui-bulk-edit.list.preview.table.active" />
        : <FormattedMessage id="ui-bulk-edit.list.preview.table.inactive" />
      }
    </AppIcon>
  ),
  lastName: user => user.personal?.lastName,
  firstName: user => user.personal?.firstName,
  barcode: user => user.barcode,
  patronGroup: user => user.patronGroup,
  username: user => user.username,
  email: user => user.personal.email,
  expirationDate: user => <FormattedTime dateString={user.expirationDate} />,
};
const columnMapping = {
  active: <FormattedMessage id="ui-bulk-edit.list.preview.table.status" />,
  lastName: <FormattedMessage id="ui-bulk-edit.list.preview.table.lastName" />,
  firstName: <FormattedMessage id="ui-bulk-edit.list.preview.table.firstName" />,
  barcode: <FormattedMessage id="ui-bulk-edit.list.preview.table.barcode" />,
  patronGroup: <FormattedMessage id="ui-bulk-edit.list.preview.table.patronGroup" />,
  username: <FormattedMessage id="ui-bulk-edit.list.preview.table.username" />,
  email: <FormattedMessage id="ui-bulk-edit.list.preview.table.email" />,
  expirationDate: <FormattedMessage id="ui-bulk-edit.list.preview.table.expirationDate" />,
};

const PreviewAccordion = ({ users }) => {
  const location = useLocation();

  const visibleColumns = useMemo(() => {
    const paramsColumns = new URLSearchParams(location.search).get('selectedColumns');
    const defaultColumns = DEFAULT_COLUMNS
      .filter(item => item.selected)
      .map(item => item.value);
    const existingColumns = DEFAULT_COLUMNS.reduce((acc, { value }) => {
      return paramsColumns?.includes(value) ? [...acc, value] : acc;
    }, []);

    return paramsColumns ? existingColumns : defaultColumns;
  }, [location.search]);

  return (
    <Accordion
      closedByDefault
      open={!!users.length}
      label={<FormattedMessage id="ui-bulk-edit.list.preview.title" />}
    >
      <Row>
        <Col xs={12}>
          <MultiColumnList
            striped
            contentData={users}
            columnMapping={columnMapping}
            formatter={resultsFormatter}
            visibleColumns={visibleColumns}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

PreviewAccordion.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
};

export default PreviewAccordion;
