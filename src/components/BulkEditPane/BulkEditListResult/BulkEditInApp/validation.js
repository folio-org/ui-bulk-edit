import { array, object, string, lazy, mixed } from 'yup';
import { FINAL_ACTIONS } from '../../../../constants';

/**
 * Top-level schema for validating an array of Administrative field objects.
 */
export const validationSchema = array(
  object({
    option: string().required(),
    actionsDetails: object({
      actions: array(object({
        name: string().required(),
        value: mixed().when('name', (name) => {
          const [actionName] = name;

          if (FINAL_ACTIONS.includes(actionName)) {
            return lazy(() => mixed().notRequired());
          }

          return lazy((value) => {
            if (Array.isArray(value)) {
              return array().min(1).required();
            }

            return string().required();
          });
        })
      }))
    })
  })
);
