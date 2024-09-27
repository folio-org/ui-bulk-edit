import { clone, setWith } from 'lodash';
import {
  CAPABILITIES,
  EDIT_CAPABILITIES_OPTIONS,
} from '../constants';

export const isCapabilityDisabled = (capabilityValue, view, perms = {}) => {
  const {
    hasItemInventoryView,
    hasHoldingsInventoryView,
    hasItemsAndHoldingsInventoryView,
    hasInstanceInventoryView,
    hasAnyUserWithBulkPerm,
  } = perms;

  const capabilitiesMap = {
    [CAPABILITIES.USER]: !hasAnyUserWithBulkPerm,
    [CAPABILITIES.ITEM]: hasItemInventoryView ?
      !hasItemInventoryView : !hasItemsAndHoldingsInventoryView,
    [CAPABILITIES.HOLDING]: hasHoldingsInventoryView ?
      !hasHoldingsInventoryView :
      !hasItemsAndHoldingsInventoryView,
    [CAPABILITIES.INSTANCE]: hasInstanceInventoryView ?
      !hasInstanceInventoryView :
      !hasItemsAndHoldingsInventoryView,
  };

  return capabilitiesMap[capabilityValue];
};

export const getCapabilityOptions = (view, perms) => EDIT_CAPABILITIES_OPTIONS.map(capability => ({
  ...capability,
  hidden: isCapabilityDisabled(capability.value, view, perms),
}));

export const groupByCategory = (array) => {
  const grouped = array.reduce((acc, item) => {
    if (item.categoryName) {
      if (!acc[item.categoryName]) {
        acc[item.categoryName] = [];
      }

      acc[item.categoryName].push(item);
    } else {
      acc[item.label] = item;
    }

    return acc;
  }, {});

  return Object.entries(grouped).map(([key, value]) => {
    if (Array.isArray(value)) {
      return {
        label: key,
        options: value,
      };
    }

    return value;
  });
};

export const getMappedAndSortedNotes = ({
  notes,
  categoryName,
  key,
  type
}) => {
  const mappedNotes = notes?.map(note => ({
    label: note?.name,
    value: note?.id,
    type,
    tenant: note?.tenantName,
    parameters: [{
      key,
      value: note?.id,
    }],
    disabled: false,
    categoryName,
  })) || [];

  return mappedNotes.sort((a, b) => a.label?.localeCompare(b?.label));
};

export const getVisibleColumnsKeys = (columns) => {
  return columns?.filter(item => item.selected).map(item => item.value);
};

export const customFilter = (value, dataOptions) => {
  return dataOptions.reduce((acc, option) => {
    const optionLabelMatched = option.label.toLowerCase().includes(value.toLowerCase());

    if (option.options?.length > 0) {
      const filteredOptions = option.options.filter(opt => opt.label.toLowerCase().includes(value.toLowerCase()));

      if (filteredOptions.length > 0) {
        acc.push({
          ...option,
          options: filteredOptions,
        });
      } else if (optionLabelMatched) {
        acc.push(option);
      }
    } else if (optionLabelMatched) {
      acc.push(option);
    }

    return acc;
  }, []);
};

export const setIn = (obj, path, value) => {
  return setWith(clone(obj), path, value, clone);
};

export const removeDuplicatesByValue = (arr = [], tenants = []) => {
  const valueMap = new Map();

  arr?.forEach(item => {
    if (!valueMap.has(item.value)) {
      valueMap.set(item.value, { ...item, tenant: [item.tenant] });
    } else {
      const existingItem = valueMap.get(item.value);

      const startIndex = existingItem.label.indexOf('(');
      const endIndex = existingItem.label.indexOf(')', startIndex);

      if (startIndex !== -1 && endIndex !== -1) {
        existingItem.label = existingItem.label.slice(0, startIndex).trim() + existingItem.label.slice(endIndex + 1).trim();
      }

      if (!existingItem.tenant.includes(item.tenant)) {
        existingItem.tenant.push(item.tenant);
      }
    }
  });

  if (tenants.length === 1) {
    arr.forEach(item => {
      const existingItem = valueMap.get(item.value);
      const tenantStartIndex = existingItem.label.indexOf('(');
      const tenantEndIndex = existingItem.label.indexOf(')', tenantStartIndex);

      if (tenantStartIndex !== -1 && tenantEndIndex !== -1) {
        existingItem.label = existingItem.label.slice(0, tenantStartIndex).trim() + existingItem.label.slice(tenantEndIndex + 1).trim();
      }
    });
  }

  return Array.from(valueMap.values()).sort((a, b) => a.label.localeCompare(b.label));
};


export const getTenantsById = (arr, id) => {
  const item = arr.find(obj => obj.value === id);
  return item ? item.tenant : null;
};

export const filterByIds = (items, ids) => {
  return items.filter(item => ids.includes(item.id));
};


