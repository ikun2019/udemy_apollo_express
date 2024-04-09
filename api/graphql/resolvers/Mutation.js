async function createMessage(parent, args, context) {
  const userId = Number(context.userId);
  const newMessage = await context.prisma.message.create({
    data: {
      text: args.text,
      postedBy: { connect: { id: userId } }
    }
  });
  return newMessage;
};

module.exports = {
  createMessage,
};