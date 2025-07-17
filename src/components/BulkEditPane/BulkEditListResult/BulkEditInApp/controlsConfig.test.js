import {
  getDefaultActionLists,
  getControlType,
  getDefaultActionState,
  getNextActionLists,
  getNextControlType,
  getNextActionState,
} from './controlsConfig';
import {
  OPTIONS,
  ACTIONS,
  CONTROL_TYPES,
  APPROACHES,
  CAPABILITIES,
  emailActionsFind,
  emailActionsReplace,
  commonAdditionalActions,
  noteActions,
  noteActionsMarc,
} from '../../../../constants';


describe('actionConfig utilities', () => {
  describe('getDefaultActionLists', () => {
    it('returns empty array for unknown option', () => {
      expect(getDefaultActionLists('UNKNOWN_OPTION', 'ANY')).toEqual([]);
    });

    it('returns email find actions for EMAIL_ADDRESS', () => {
      const list = getDefaultActionLists(OPTIONS.EMAIL_ADDRESS, CAPABILITIES.USER);
      expect(list).toEqual(emailActionsFind());
    });

    it('returns noteActionsMarc for ADMINISTRATIVE_NOTE with MARC record type', () => {
      const list = getDefaultActionLists(OPTIONS.ADMINISTRATIVE_NOTE, CAPABILITIES.INSTANCE, APPROACHES.MARC);
      expect(list).toEqual(noteActionsMarc());
    });

    it('returns noteActions for ADMINISTRATIVE_NOTE with non-MARC record type', () => {
      const list = getDefaultActionLists(OPTIONS.ADMINISTRATIVE_NOTE, CAPABILITIES.INSTANCE);
      expect(list).toEqual(noteActions());
    });
  });

  describe('getControlType', () => {
    it('returns null for unknown option', () => {
      expect(getControlType('UNKNOWN_OPTION', ACTIONS.FIND)).toBeNull();
    });

    it('returns INPUT for EMAIL_ADDRESS controlType', () => {
      expect(getControlType(OPTIONS.EMAIL_ADDRESS, ACTIONS.FIND)).toBe(CONTROL_TYPES.INPUT);
    });

    it('returns NOTE_SELECT for ADMINISTRATIVE_NOTE CHANGE_TYPE action', () => {
      expect(getControlType(OPTIONS.ADMINISTRATIVE_NOTE, ACTIONS.CHANGE_TYPE))
        .toBe(CONTROL_TYPES.NOTE_SELECT);
    });

    it('returns TEXTAREA for ADMINISTRATIVE_NOTE other action', () => {
      expect(getControlType(OPTIONS.ADMINISTRATIVE_NOTE, 'OTHER_ACTION'))
        .toBe(CONTROL_TYPES.TEXTAREA);
    });
  });

  describe('getDefaultActionState', () => {
    it('returns empty array for unknown option', () => {
      expect(getDefaultActionState('UNKNOWN_OPTION', CAPABILITIES.ITEM)).toEqual([]);
    });

    it('returns template state for EMAIL_ADDRESS', () => {
      const state = getDefaultActionState(OPTIONS.EMAIL_ADDRESS, CAPABILITIES.USER);
      expect(state).toHaveProperty('actions');
      expect(state.actions).toEqual([
        { name: ACTIONS.FIND, value: '' },
        { name: ACTIONS.REPLACE_WITH, value: '' },
      ]);
    });

    it('includes parameters for CHECK_IN_NOTE recordType', () => {
      const state = getDefaultActionState(OPTIONS.CHECK_IN_NOTE, 'USER');
      expect(state.actions[0]).toHaveProperty('parameters');
    });
  });

  describe('getNextActionLists', () => {
    it('returns empty for non-FIND action or unsupported option', () => {
      expect(getNextActionLists(OPTIONS.EMAIL_ADDRESS, 'OTHER')).toEqual([]);
      expect(getNextActionLists('UNKNOWN_OPTION', ACTIONS.FIND)).toEqual([]);
    });

    it('returns replace actions for EMAIL_ADDRESS on FIND', () => {
      const next = getNextActionLists(OPTIONS.EMAIL_ADDRESS, ACTIONS.FIND);
      expect(next).toEqual(emailActionsReplace());
    });

    it('returns common additional actions for ITEM_NOTE on FIND', () => {
      const next = getNextActionLists(OPTIONS.ITEM_NOTE, ACTIONS.FIND);
      expect(next).toEqual(commonAdditionalActions());
    });
  });

  describe('getNextControlType', () => {
    it('returns null if action is not FIND', () => {
      expect(getNextControlType(OPTIONS.EMAIL_ADDRESS, 'OTHER')).toBeNull();
    });

    it('returns input for EMAIL_ADDRESS on FIND', () => {
      expect(getNextControlType(OPTIONS.EMAIL_ADDRESS, ACTIONS.FIND))
        .toBe(CONTROL_TYPES.INPUT);
    });

    it('returns null for unsupported option on FIND', () => {
      expect(getNextControlType('UNKNOWN_OPTION', ACTIONS.FIND)).toBeNull();
    });
  });

  describe('getNextActionState', () => {
    it('returns empty array when not FIND or unsupported', () => {
      expect(getNextActionState(OPTIONS.EMAIL_ADDRESS, 'OTHER')).toEqual([]);
      expect(getNextActionState('UNKNOWN_OPTION', ACTIONS.FIND)).toEqual([]);
    });

    it('returns template next state for FIND on supported option', () => {
      const nextState = getNextActionState(OPTIONS.EMAIL_ADDRESS, ACTIONS.FIND);
      expect(nextState).toEqual([{ name: '', value: '' }]);
    });
  });
});
