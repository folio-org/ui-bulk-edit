import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';

import { BulkEditSettings } from '../settings/BulkEditSettings';
import { BulkEditPane } from './BulkEditPane/BulkEditPane';


const BulkEdit = (props) => {
  if (props.showSettings) {
    return (
      <BulkEditSettings {...props} />
    );
  }

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <Switch>
        <Route
          path="/bulk-edit"
          component={BulkEditPane}
        />
      </Switch>
    </CommandList>
  );
};

BulkEdit.propTypes = {
  showSettings: PropTypes.bool,
};

export default BulkEdit;
