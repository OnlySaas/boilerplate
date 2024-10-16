export const createInvitationBodySchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    role: { type: "string", enum: ["owner", "admin", "member"] },
  },
  required: ["email", "role"],
  additionalProperties: false,
} as const;

export const createInvitationPathParametersSchema = {
  type: "object",
  properties: { organizationId: { type: "string" } },
  required: ["organizationId"],
  additionalProperties: false,
} as const;

export const createInvitationSchema = {
  type: "object",
  required: ["body", "pathParameters"],
  properties: {
    body: createInvitationBodySchema,
    pathParameters: createInvitationPathParametersSchema,
  },
};
