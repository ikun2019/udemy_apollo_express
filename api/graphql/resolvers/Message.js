async function postedBy(parent, args, context) {
  return context.prisma.message.findUnique({
    where: { id: parent.id }
  }).postedBy();
};

module.exports = {
  postedBy,
};