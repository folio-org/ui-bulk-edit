import { useEffect, useRef } from 'react';
import { ACTIONS, OPTIONS } from '../constants';
import {
  getActionIndex,
  getOptionIndex,
} from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';

/**
 * Custom hook that derives and synchronizes dependent field values
 * based on the selected options and actions.
 *
 * This hook monitors certain field states (e.g., set for delete, suppress from discovery)
 * and ensures that related fields are updated consistently when one changes.
 *
 * @param {Array<Object>} fields - The current list of field objects containing `option` and `actionsDetails`.
 * @param {Function} setFields - State updater function for modifying the fields array.
 * @param {Object} opts - Optional parameters. Currently, supports: isActive (boolean) to enable/disable the rules.
 */
export const useDerivedFields = (fields, setFields, opts = {}) => {
  const { isActive = true } = opts;

  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const setForDeleteTrueIndex = getActionIndex(
    fields,
    OPTIONS.SET_RECORDS_FOR_DELETE,
    ACTIONS.SET_TO_TRUE,
  );
  const setForDeleteFalseIndex = getActionIndex(
    fields,
    OPTIONS.SET_RECORDS_FOR_DELETE,
    ACTIONS.SET_TO_FALSE,
  );
  const suppressFromDiscoveryTrueIndex = getActionIndex(
    fields,
    OPTIONS.SUPPRESS_FROM_DISCOVERY,
    ACTIONS.SET_TO_TRUE,
  );
  const suppressFromDiscoveryFalseIndex = getActionIndex(
    fields,
    OPTIONS.SUPPRESS_FROM_DISCOVERY,
    ACTIONS.SET_TO_FALSE,
  );
  const staffSupressIndex = getOptionIndex(fields, OPTIONS.STAFF_SUPPRESS);
  const suppressFromDiscoveryIndex = getOptionIndex(
    fields,
    OPTIONS.SUPPRESS_FROM_DISCOVERY,
  );

  /**
   * If "Set for Delete" is toggled, enforce that
   * STAFF_SUPPRESS and SUPPRESS_FROM_DISCOVERY are updated accordingly.
   */
  useEffect(() => {
    if (!isActiveRef.current) return;

    if (setForDeleteTrueIndex !== -1 || setForDeleteFalseIndex !== -1) {
      setFields(prevFields => prevFields.map(field => {
        if (
          [OPTIONS.STAFF_SUPPRESS, OPTIONS.SUPPRESS_FROM_DISCOVERY].includes(
            field.option,
          )
        ) {
          const getUpdatedName = (name) => {
            if (setForDeleteTrueIndex !== -1) {
              return ACTIONS.SET_TO_TRUE;
            }

            if (name) {
              return name;
            }

            return '';
          };

          return {
            ...field,
            actionsDetails: {
              actions: field.actionsDetails.actions.map(action => ({
                ...action,
                name: getUpdatedName(action.name),
              })),
            },
          };
        }

        return field;
      }));
    }
  }, [setForDeleteTrueIndex, setForDeleteFalseIndex, setFields]);

  /**
   * If "Suppress from Discovery" is toggled,
   * ensure the field parameters are updated with the correct boolean value.
   */
  useEffect(() => {
    if (!isActiveRef.current) return;

    if (suppressFromDiscoveryTrueIndex !== -1 || suppressFromDiscoveryFalseIndex !== -1) {
      setFields(prevFields => prevFields.map(field => {
        if (field.option === OPTIONS.SUPPRESS_FROM_DISCOVERY) {
          return {
            ...field,
            actionsDetails: {
              actions: field.actionsDetails.actions.map(action => ({
                ...action,
                parameters: action.parameters.map(param => ({
                  ...param,
                  value: suppressFromDiscoveryTrueIndex !== -1,
                })),
              })),
            },
          };
        }

        return field;
      }));
    }
  }, [suppressFromDiscoveryTrueIndex, suppressFromDiscoveryFalseIndex, setFields]);

  /**
   * If STAFF_SUPPRESS or SUPPRESS_FROM_DISCOVERY exist
   * and "Set for Delete" is active, enforce setting action to true.
   */
  useEffect(() => {
    if (!isActiveRef.current) return;

    if (staffSupressIndex !== -1 || suppressFromDiscoveryIndex !== -1) {
      setFields(prevFields => prevFields.map(field => {
        if (
          setForDeleteTrueIndex !== -1 &&
            [OPTIONS.STAFF_SUPPRESS, OPTIONS.SUPPRESS_FROM_DISCOVERY].includes(
              field.option,
            )
        ) {
          return {
            ...field,
            actionsDetails: {
              actions: field.actionsDetails.actions.map(action => ({
                ...action,
                name: ACTIONS.SET_TO_TRUE,
              })),
            },
          };
        }

        return field;
      }));
    }
  }, [staffSupressIndex, suppressFromDiscoveryIndex, setForDeleteTrueIndex, setFields]);
};
