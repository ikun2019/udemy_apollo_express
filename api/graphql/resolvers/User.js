function messages(parent, args, context) {
  return context.prisma.user.findUnique({
    where: { id: parent.id }
  }).messages();
};

module.exports = {
  messages,
}