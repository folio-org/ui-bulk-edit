import { FormattedMessage } from 'react-intl';
import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { useDownloadErrors } from '../../API/useErrorDownload';

export const BulkEditActionMenu = ({
  onEdit,
  onDelete,
  onToggle,
}) => {
  function useParams(path) {
    const { pathname } = useLocation();
    const match = matchPath(pathname, { path });

    return match?.params || {};
  }

  const { id } = useParams('/bulk-edit/:id');

  const buildButtonClickHandler = buttonClickHandler => () => {
    buttonClickHandler();

    onToggle();
  };

  const { data } = useDownloadErrors(id);

  return (
    <>
      {data?.files[1] ?
        <IfPermission perm="ui-bulk-edit.edit">
          <a href={data.files[1]} download>
            <Button
              buttonStyle="dropdownItem"
              data-testid="download-link-test"
            >
              <Icon icon="download">
                <FormattedMessage id="ui-bulk-edit.start.downloadErrors" />
              </Icon>
            </Button>
          </a>
        </IfPermission>
        : null}
      <IfPermission perm="ui-bulk-edit.edit">
        <Button
          buttonStyle="dropdownItem"
          onClick={buildButtonClickHandler(onEdit)}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-bulk-edit.start.edit" />
          </Icon>
        </Button>
      </IfPermission>
      <IfPermission perm="ui-bulk-edit.delete">
        <Button
          buttonStyle="dropdownItem"
          onClick={buildButtonClickHandler(onDelete)}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-bulk-edit.start.delete" />
          </Icon>
        </Button>
      </IfPermission>
    </>
  );
};

BulkEditActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
