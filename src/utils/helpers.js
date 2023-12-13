import {
  CAPABILITIES,
  EDIT_CAPABILITIES_OPTIONS,
} from '../constants';

export const isCapabilityDisabled = (capabilityValue, view, perms = {}) => {
  const {
    hasItemInventoryView,
    hasHoldingsInventoryView,
    hasItemsAndHoldingsInventoryView,
    hasAnyUserWithBulkPerm,
  } = perms;

  const capabilitiesMap = {
    [CAPABILITIES.USER]: !hasAnyUserWithBulkPerm,
    [CAPABILITIES.ITEM]: hasItemInventoryView ?
      !hasItemInventoryView : !hasItemsAndHoldingsInventoryView,
    [CAPABILITIES.HOLDING]: hasHoldingsInventoryView ?
      !hasHoldingsInventoryView :
      !hasItemsAndHoldingsInventoryView,
  };

  return capabilitiesMap[capabilityValue];
};

export const getCapabilityOptions = (view, perms) => EDIT_CAPABILITIES_OPTIONS.map(capability => ({
  ...capability,
  hidden: isCapabilityDisabled(capability.value, view, perms),
}));

export const getDefaultCapabilities = (view, perms) => {
  const capabilityOptions = getCapabilityOptions(view, perms);

  return capabilityOptions.find(option => !option.hidden)?.value;
};

export const groupByCategory = (array) => {
  return array.reduce((acc, item) => {
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
};

export const getMappedAndSortedNotes = ({
  notes,
  categoryName,
  key,
  type
}) => {
  const mappedNotes = notes?.map(note => ({
    label: note.name,
    value: note.id,
    type,
    parameters: [{
      key,
      value: note.id,
    }],
    disabled: false,
    categoryName,
  })) || [];

  return mappedNotes.sort((a, b) => a.label.localeCompare(b.label));
};

export const getVisibleColumnsKeys = (columns) => {
  return columns?.filter(item => item.selected).map(item => item.value);
};

