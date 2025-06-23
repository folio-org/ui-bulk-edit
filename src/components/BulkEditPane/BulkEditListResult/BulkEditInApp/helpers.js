import uniqueId from 'lodash/uniqueId';

import { dayjs } from '@folio/stripes/components';

import {
  OPTIONS,
  BASE_DATE_FORMAT,
  FINAL_ACTIONS,
  ACTIONS,
  getAddAction,
  getRemoveSomeAction,
  getPlaceholder,
} from '../../../../constants';

export const TEMPORARY_LOCATIONS = [OPTIONS.TEMPORARY_LOCATION, OPTIONS.TEMPORARY_HOLDINGS_LOCATION];

const OPTIONS_MAP = {
  [OPTIONS.TEMPORARY_HOLDINGS_LOCATION]: OPTIONS.TEMPORARY_LOCATION,
  [OPTIONS.PERMANENT_HOLDINGS_LOCATION]: OPTIONS.PERMANENT_LOCATION,
};

const ACTIONS_SPLIT_MAP = {
  [ACTIONS.FIND_REPLACE_WITH]: [ACTIONS.FIND, ACTIONS.REPLACE_WITH],
  [ACTIONS.FIND_REMOVE_THESE]: [ACTIONS.FIND, ACTIONS.REMOVE_THESE],
};

export const initialDataToTemplate = (data) => {
  return data.map((item) => {
    const actions = item.rule_details.actions;
    const { initial, updated, parameters, tenants, type, updated_tenants } = actions[0];
    const [initialAction, updateAction] = ACTIONS_SPLIT_MAP[type] || [type];
    const updateActionName = updateAction || initialAction;

    const actionDetails = [
      ...([initial && initialAction ? {
        name: initialAction,
        value: initial,
        parameters,
        tenants
      } : null]),
      {
        name: updateActionName,
        value: updated,
        parameters,
        tenants,
        updated_tenants,
      }
    ];

    return {
      id: uniqueId(),
      option: item.rule_details.option,
      tenants: item.rule_details.tenants || [],
      parameters: parameters || [],
      actionDetails,
    };
  });
};

export const getFormattedDate = (value) => {
  const date = `${value} 23:59:59`;
  const format = `${BASE_DATE_FORMAT}[T]HH:mm:ss`;

  return `${dayjs.utc(date).format(format)}.000Z`;
};

export const getContentUpdatesBody = ({ bulkOperationId, contentUpdates, totalRecords }) => {
  const bulkOperationRules = contentUpdates.reduce((acc, item) => {
    const formattedItem = () => {
      const isExpirationDate = item.option === OPTIONS.EXPIRATION_DATE;

      return {
        option: OPTIONS_MAP[item.option] || item.option,
        tenants: item?.tenants,
        actions: item.actions.map(action => ({
          ...action,
          updated: isExpirationDate ? getFormattedDate(action.updated) : action.updated,
          tenants: action?.tenants
        })),
      };
    };

    acc.push({
      bulkOperationId,
      rule_details: formattedItem(),
    });


    return acc;
  }, []);

  return {
    bulkOperationRules,
    totalRecords,
  };
};

export const getStatisticalCodeActionIndex = (fields, action) => fields.findIndex(({ option, actionsDetails }) => {
  return option === OPTIONS.STATISTICAL_CODE && actionsDetails.actions
    .some(({ name }) => name === action);
});

export const getFieldsWithRules = ({
  action,
  option,
  rowId,
  fields
}) => {
  if (option === OPTIONS.STATISTICAL_CODE && action === ACTIONS.REMOVE_ALL) {
    return fields.filter(f => f.id === rowId || f.option !== OPTIONS.STATISTICAL_CODE);
  }

  return fields;
};

export const getOptionsWithRules = ({ fields, options, usedOptions }) => {
  const removeAllIndex = getStatisticalCodeActionIndex(fields, ACTIONS.REMOVE_ALL);
  const addIndex = getStatisticalCodeActionIndex(fields, ACTIONS.ADD_TO_EXISTING);
  const removeSomeIndex = getStatisticalCodeActionIndex(fields, ACTIONS.REMOVE_SOME);
  const hasAddOrRemoveSome = addIndex !== -1 || removeSomeIndex !== -1;

  const instancesMap = {
    [OPTIONS.STATISTICAL_CODE]: removeAllIndex !== -1 || !hasAddOrRemoveSome ? 1 : 2
  };

  const filteredOptions = options.filter(opt => {
    const used = usedOptions.filter(o => o === opt.value).length;
    const limit = instancesMap[opt.value] ?? 1;

    return used < limit;
  });

  const maxRowsCount = options.length -
    Object.keys(instancesMap).length +
    Object.values(instancesMap).reduce((acc, val) => acc + val, 0);

  return {
    maxRowsCount,
    filteredOptions,
  };
};

export const getActionsWithRules = ({
  row,
  option,
  actions,
  fields
}) => {
  const addActionIndex = getStatisticalCodeActionIndex(fields, ACTIONS.ADD_TO_EXISTING);
  const removeActionIndex = getStatisticalCodeActionIndex(fields, ACTIONS.REMOVE_SOME);
  const currentIndex = fields.findIndex(field => field.id === row.id);

  if (option === OPTIONS.STATISTICAL_CODE) {
    if (addActionIndex !== -1 && addActionIndex !== currentIndex) {
      return [
        getPlaceholder(),
        getRemoveSomeAction()
      ];
    }

    if (removeActionIndex !== -1 && removeActionIndex !== currentIndex) {
      return [
        getPlaceholder(),
        getAddAction()
      ];
    }
  }

  return actions;
};

export const getLabelByValue = (items, targetValue) => {
  return items?.find((labeledValue) => labeledValue.value === targetValue)?.label;
};

export const sortWithoutPlaceholder = (array) => {
  if (!array.length) return [];

  const [placeholder, ...rest] = array;

  return [placeholder, ...rest.sort((a, b) => a.label.localeCompare(b.label))];
};

export const getMappedContentUpdates = (fields, options) => fields.map((field) => {
  const { parameters, tenants, option, actionsDetails: { actions } } = field;

  if (!actions) return field;

  const [initial, updated] = actions.map(action => {
    if (Array.isArray(action?.value)) {
      return action.value.map(item => item?.value).join(',');
    }

    return action?.value || null;
  });
  const actionTenants = actions.map(action => action?.tenants);
  const sourceOption = options.find(o => o.value === option);
  const optionType = sourceOption?.type;
  const mappedOption = optionType || option; // if option has type, use it, otherwise use option value (required for ITEM_NOTE cases)
  // generate action type key with '_' delimiter
  const typeKey = actions
    .filter(Boolean)
    .map(action => action?.name ?? null).join('_');

  const actionParameters = actions.find(action => Boolean(action?.parameters))?.parameters;
  const filteredTenants = actionTenants.filter(Boolean);
  // final action is the action which doesn't require any additional data after it
  const isSecondActionFinal = FINAL_ACTIONS.includes(actions[1]?.name);

  const activeTenants = isSecondActionFinal || filteredTenants.length === 1
    ? filteredTenants.flat()
    : filteredTenants
      .flat()
      .filter((tenant, index, array) => array.indexOf(tenant) !== index);

  // That tenants array need when we use find and replace action with two different action values
  const updatedTenants = filteredTenants[1] || [];
  const type = ACTIONS[typeKey];

  return {
    option: mappedOption,
    tenants: tenants?.filter(Boolean),
    actions: [{
      type,
      initial,
      updated,
      tenants: activeTenants,
      updated_tenants: updatedTenants,
      parameters: [
        ...(parameters || []),
        ...(actionParameters || []),
      ],
    }],
  };
});

export const folioFieldTemplate = (id) => {
  return ({
    ...(id ? { id } : {}),
    option: '',
    tenants: [],
    actionsDetails: []
  });
};
