async function messages(parent, args, context) {
  const messages = await context.prisma.messages.findMany();
  return messages.data;
};

module.exports = {
  messages,
};