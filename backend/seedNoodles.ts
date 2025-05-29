import { Context, InstantNoodleOriginCountryType } from '.keystone/types';
import noodles from './noodles';

export async function seedNoodleData(context: Context) {
  for (const item of noodles) {
    const existing = await context.db.InstantNoodle.findMany({
      where: { name: { equals: item.name } },
    });

    if (existing.length === 0) {
      let category = await context.db.Category.findOne({
        where: { name: item.category },
      });

      if (!category) {
        category = await context.db.Category.createOne({
          data: { name: item.category },
        });
      }

      await context.db.InstantNoodle.createOne({
        data: {
          name: item.name,
          brand: item.brand,
          spicinessLevel: item.spicinessLevel,
          originCountry: item.originCountry as InstantNoodleOriginCountryType,
          rating: item.rating,
          category: { connect: { id: category.id } },
        },
      });

      console.log(`Seeded noodle: ${item.name}`);
    } else {
      console.log(`Skipping existing noodle: ${item.name}`);
    }
  }
}
