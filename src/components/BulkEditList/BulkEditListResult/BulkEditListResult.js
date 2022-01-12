import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { Preview } from './Preview/Preview';
import { ProgressBar } from '../../ProgressBar/ProgressBar';


const BulkEditListResult = ({ fileUpdatedName, progress }) => {
  return (
    <Switch>
      <Route
        path="/bulk-edit/progress"
        component={() => <ProgressBar title={fileUpdatedName} progress={progress} />}
      />
      <Route path="/bulk-edit" exact component={NoResultsMessage} />
      <Route
        path="/bulk-edit/:id"
        component={() => <Preview />}
      />
    </Switch>
  );
};

export default BulkEditListResult;

BulkEditListResult.propTypes = {
  fileUpdatedName: PropTypes.string,
  progress: PropTypes.number,
};
