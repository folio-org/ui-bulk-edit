import { FormattedMessage } from 'react-intl';
import React from 'react';
import {
  ACTIONS,
  FINAL_ACTIONS,
  getAdditionalSubfieldAction,
  getPlaceholder,
  markActions, markSubfieldActions
} from '../../../../constants/markActions';

export const TAG_FIELD_MAX_LENGTH = 3;
export const INDICATOR_FIELD_MAX_LENGTH = 1;
export const SUBFIELD_MAX_LENGTH = 1;

export const isFinalAction = (action) => action && FINAL_ACTIONS.includes(action);

export const getDataTemplate = ({
  required = true,
  key = 'VALUE',
} = {}) => ({
  meta: {
    title: <FormattedMessage id="ui-bulk-edit.layer.column.data" />,
    required,
  },
  key,
  value: '',
});

export const getDefaultMarkTemplate = (id) => ({
  id,
  value: '',
  in1: '\\',
  in2: '\\',
  subfield: '',
  actions: [
    {
      meta: {
        options: markActions(),
        required: true,
      },
      name: '',
      data: []
    },
  ],
  parameters: [],
  subfields: [],
});

export const getSubfieldTemplate = (id) => ({
  id,
  subfield: '',
  actions: [
    {
      meta: {
        options: markSubfieldActions(),
        disabled: true,
        required: true,
      },
      name: ACTIONS.ADD_TO_EXISTING,
      data: [
        {
          meta: {
            title: <FormattedMessage id="ui-bulk-edit.layer.column.data" />,
            required: true,
          },
          key: 'VALUE',
          value: '',
        }
      ]
    },
    {
      meta: {
        options: [
          getPlaceholder(),
          getAdditionalSubfieldAction(),
        ],
        disabled: false,
        required: false,
      },
      name: '',
      data: []
    },
  ],
});

export const getNextAction = (action) => {
  switch (action) {
    case ACTIONS.ADD_TO_EXISTING:
      return {
        meta: {
          options: [
            getPlaceholder(),
            getAdditionalSubfieldAction(),
          ],
        },
        name: '',
        data: [],
      };
    default:
      return null;
  }
};

export const getNextDataControls = (action) => {
  switch (action) {
    case ACTIONS.ADD_TO_EXISTING:
      return [
        getDataTemplate(),
      ];
    default:
      return [];
  }
};


export const isMarkFormValid = (fields) => {
  return fields.every(field => Object.values(field).every(Boolean));
};

export const getFielMaxColumnsCount = (field) => {
  let sum = field.actions.length;

  field.actions.forEach(action => {
    sum += action?.data.length || 0;
  });

  return sum;
};
