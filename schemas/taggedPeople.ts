import { z } from 'zod';

export const taggedPeopleSchema = z.object({
  operationName: z.string(),
  data: z.array(
    z.object({
      name: z.string(),
      surname: z.string(),
      gender: z.string(),
      born: z.number(),
      city: z.string(),
      tags: z.array(
        z.enum([
          'IT',
          'transport',
          'medycyna',
          'edukacja',
          'praca z ludźmi',
          'praca z pojazdami',
          'praca fizyczna',
        ])
      ),
    })
  ),
});
