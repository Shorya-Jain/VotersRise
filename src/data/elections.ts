import { z } from 'astro/zod';
import raw from './elections.json';

const date = z.iso.date();

const schema = z.object({
  publishSchedules: z.boolean(),
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
}).superRefine((data, ctx) => {
  // Unverified working data stays private to the repository, not in generated pages.
  if (!data.publishSchedules) return;
  const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
  const verifySource = (id: string | undefined, entry: string) => {
    const source = id ? data.sources[id] : undefined;
    if (!source?.url) { issue(`${entry}: an official source URL is required`); return; }
    const url = new URL(source.url);
    if (url.protocol !== 'https:' || !/\.(gov|nic)\.in$/.test(url.hostname)) {
      issue(`${entry}: replace secondary sources with an official government URL`);
    }
  };
  if (data.lastVerified > new Date().toISOString().slice(0, 10)) issue('lastVerified cannot be in the future');
  for (const election of data.elections) {
    verifySource(election.source, election.id);
    if (election.status !== 'expected' && !election.lastDateOfNominations) {
      issue(`${election.id}: an announced election requires its nomination deadline`);
    }
  }
  for (const group of data.sir.groups) {
    verifySource(group.source, group.states.join(', '));
    if (!group.claimsTo || group.draft > group.claimsFrom || group.claimsFrom > group.claimsTo || group.claimsTo > group.final) {
      issue(`${group.states.join(', ')}: provide a complete, ordered revision schedule`);
    }
  }
});

export const data = schema.parse(raw);
