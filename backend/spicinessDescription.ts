// ...existing imports...
import { list } from '@keystone-6/core';
import { integer, virtual } from '@keystone-6/core/fields';
import { graphql } from '@keystone-6/core';

// ...existing code...

export const InstantNoodle = list({
  fields: {
    // ...existing fields...
    spicinessLevel: integer({ /* ...existing config... */ }),
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
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
    // ...existing fields...
  },
  // ...existing config...
});
// ...existing code...
