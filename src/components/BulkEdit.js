import {
  Switch,
  Route,
} from 'react-router-dom';

import { BulkEditPane } from './BulkEditPane/BulkEditPane';
import { BulkEditSettings } from '../settings/BulkEditSettings';


const BulkEdit = (props) => {
  if (props.showSettings) {
    return <BulkEditSettings {...props} />;
  }

  return (
    <Switch>
      <Route
        path="/bulk-edit"
        component={BulkEditPane}
      />
    </Switch>
  );
};

export default BulkEdit;
