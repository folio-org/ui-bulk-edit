import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { useDownloadLinks } from '../../API/useDownloadLinks';
import { usePathParams } from '../../hooks/usePathParams';

export const BulkEditActionMenu = ({
  onEdit,
  onDelete,
  onToggle,
}) => {
  const { id } = usePathParams('/bulk-edit/:id');

  const buildButtonClickHandler = buttonClickHandler => () => {
    buttonClickHandler();

    onToggle();
  };

  const { data } = useDownloadLinks(id);

  // eslint-disable-next-line no-unused-vars
  const [successCsvLink, errorCsvLink] = data?.files || [];

  return (
    <>
      {
       errorCsvLink &&
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
      }
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
