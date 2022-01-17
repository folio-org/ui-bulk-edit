import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { Preview } from './Preview/Preview';
import { ProgressBar } from '../../ProgressBar/ProgressBar';

export const BulkEditListResult = ({ fileUploadedName, fileUpdatedName, updatedId }) => {
  return (
    <Switch>
      <Route
        path="/bulk-edit/:id/progress"
        component={() => <ProgressBar title={fileUpdatedName} updatedId={updatedId} />}
      />
      <Route path="/bulk-edit" exact component={NoResultsMessage} />
      <Route
        path="/bulk-edit/:id"
        component={() => <Preview fileUploadedName={fileUploadedName} />}
      />
    </Switch>
  );
};

BulkEditListResult.propTypes = {
  fileUploadedName: PropTypes.string,
  fileUpdatedName: PropTypes.string,
  updatedId: PropTypes.string,
};
