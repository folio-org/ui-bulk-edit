import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import BulkEditMark from '../BulkEditListResult/BulkEditMark/BulkEditMark';


const BulkEditMarkLayer = ({
  isMarkLayerOpen,
  isMarkFieldsValid,
  closeMarkLayer,
  paneProps,
}) => {
  return (
    <BulkEditLayer
      isLayerOpen={isMarkLayerOpen}
      isConfirmDisabled={!isMarkFieldsValid}
      onLayerClose={closeMarkLayer}
      onConfirm={noop}
      {...paneProps}
    >
      <BulkEditMark />
    </BulkEditLayer>
  );
};

BulkEditMarkLayer.propTypes = {
  isMarkLayerOpen: PropTypes.bool,
  isMarkFieldsValid: PropTypes.bool,
  closeMarkLayer: PropTypes.func,
  paneProps: PropTypes.object,
};

export default BulkEditMarkLayer;
