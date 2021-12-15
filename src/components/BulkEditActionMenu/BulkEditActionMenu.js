import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { useDownloadLinks } from '../../API/useDownloadLinks';
import { usePathParams } from '../../hooks/usePathParams';

const BulkEditActionMenu = ({
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

  const [successCsvLink, errorCsvLink] = data?.files || [];

  return (
    <>
      {
       successCsvLink &&
       <IfPermission perm="ui-bulk-edit.edit">
         <a href={successCsvLink} download>
           <Button
             buttonStyle="dropdownItem"
             data-testid="download-link-test"
           >
             <Icon icon="download">
               <FormattedMessage id="ui-bulk-edit.start.downloadMathcedRecords" />
             </Icon>
           </Button>
         </a>
       </IfPermission>
      }
      {
       errorCsvLink &&
       <IfPermission perm="ui-bulk-edit.edit">
         <a href={errorCsvLink} download>
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

export default BulkEditActionMenu;
