import { z } from 'astro/zod';
import raw from './elections.json';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const schema = z.object({
  lastVerified: date,
  elections: z.array(
    z.object({
      id: z.string(),
      state: z.string(),
      status: z.enum(['expected', 'announced', 'frozen']),
      when: z.enum(['early2027', 'late2027']),
      // Set once ECI announces the schedule.
      lastDateOfNominations: date.optional(),
      source: z.string().optional(),
    }),
  ),
  sir: z.object({
    pending: z.array(z.string()),
    groups: z.array(
      z.object({
        states: z.array(z.string()),
        draft: date,
        claimsFrom: date,
        claimsTo: date.optional(),
        final: date,
        source: z.string(),
        revised: z.boolean().optional(),
      }),
    ),
  }),
  sources: z.record(z.string(), z.object({ label: z.string(), url: z.url().optional() })),
});

export const data = schema.parse(raw);
