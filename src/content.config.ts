import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const locale = z.enum(['te', 'en']);

const programs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/programs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale,
    order: z.number().int().positive(),
    format: z.string(),
    currentStage: z.string(),
    published: z.boolean().default(true),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale,
    type: z.string(),
    availability: z.enum(['available', 'review']),
    url: z.url().optional(),
    published: z.boolean().default(true),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    caption: z.string(),
    locale,
    image: z.string(),
    alt: z.string(),
    credit: z.string(),
    creditUrl: z.url(),
    published: z.boolean().default(true),
  }),
});

const events = defineCollection({
  loader: async () => [],
  schema: z.object({
    title: z.string(),
    locale,
    date: z.coerce.date(),
    timeZone: z.literal('Asia/Kolkata'),
    status: z.enum(['confirmed', 'cancelled']),
    published: z.boolean().default(false),
  }),
});

const settings = defineCollection({
  loader: file('src/data/site.yaml'),
  schema: z.object({
    id: z.string(),
    locale,
    organizationName: z.string(),
    informalName: z.string(),
    location: z.string(),
    classPlatform: z.literal('Telegram'),
    timeZone: z.literal('Asia/Kolkata'),
  }),
});

const schedule = defineCollection({
  loader: file('src/data/schedule.yaml'),
  schema: z.object({
    id: z.string(),
    locale,
    status: z.literal('announced-in-telegram'),
    message: z.string(),
  }),
});

export const collections = { programs, resources, gallery, events, settings, schedule };
