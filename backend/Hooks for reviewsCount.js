// ...existing imports...
import { graphql, list } from '@keystone-6/core';
import {
  text,
  integer,
  select,
  relationship,
  timestamp,
  virtual,
} from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

// ...existing code...

export const lists = {
  InstantNoodle: list({
    access: allowAll,
    fields: {
      // ...existing fields...
      reviewsCount: integer({
        defaultValue: 0,
        validation: { isRequired: true },
        ui: { description: 'Number of reviews for this noodle' },
      }),
      lastReviewedAt: timestamp({
        defaultValue: null,
        ui: { description: 'Set automatically when reviewsCount increases' },
      }),
      spicinessLevel: integer({
        validation: { isRequired: true, min: 1, max: 5 },
        defaultValue: 3,
        ui: { description: 'Scale of 1 (mild) to 5 (🔥)' },
      }),
      spicinessDescription: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve(item) {
            const level = item.spicinessLevel;
            if (level === 1 || level === 2) return 'Mild';
            if (level === 3 || level === 4) return 'Medium';
            if (level === 5) return 'Hot';
            return null;
          },
          description: 'A word describing the spiciness level',
        }),
        ui: { itemView: { fieldMode: 'read' } },
      }),
      // ...other fields...
    },
    hooks: {
      async validateInput({ resolvedData, item, addValidationError, operation }) {
        if (
          operation === 'update' &&
          resolvedData.reviewsCount !== undefined &&
          item
        ) {
          if (resolvedData.reviewsCount < item.reviewsCount) {
            addValidationError('reviewsCount cannot be decreased.');
          }
        }
      },
      async resolveInput({ resolvedData, item, operation }) {
        // Only set lastReviewedAt if reviewsCount increases
        if (
          operation === 'update' &&
          resolvedData.reviewsCount !== undefined &&
          item &&
          resolvedData.reviewsCount > item.reviewsCount
        ) {
          return {
            ...resolvedData,
            lastReviewedAt: new Date().toISOString(),
          };
        }
        return resolvedData;
      },
    },
    // ...existing config...
  }),
  // ...other lists...
};
// ...existing code...