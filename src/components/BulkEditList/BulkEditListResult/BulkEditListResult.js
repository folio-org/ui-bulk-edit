import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { Preview } from './Preview/Preview';
import { ProgressBar } from '../../ProgressBar/ProgressBar';


const BulkEditListResult = ({ fileUploadedName, fileUpdatedName, progress }) => {
  return (
    <Switch>
      <Route
        path="/bulk-edit/progress"
        component={() => <ProgressBar title={fileUpdatedName} progress={progress} />}
      />
      <Route path="/bulk-edit" exact component={NoResultsMessage} />
      <Route
        path="/bulk-edit/:id"
        component={() => <Preview fileUploadedName={fileUploadedName} />}
      />
    </Switch>
  );
};

export default BulkEditListResult;

BulkEditListResult.propTypes = {
  fileUploadedName: PropTypes.string,
  fileUpdatedName: PropTypes.string,
  progress: PropTypes.number,
};
