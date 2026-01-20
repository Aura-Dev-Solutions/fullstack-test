import z from "zod";

const organizationBody = z.object({
  name: z.string().min(2).max(50),
});

export const organizationSchema = z.object({
  body: z.any(),
  params: z.any(),
  query: z.any(),
});

export const updateOrganizationSchema = z.object({
  body: organizationBody.partial(),
  params: z.any(),
  query: z.any(),
});
