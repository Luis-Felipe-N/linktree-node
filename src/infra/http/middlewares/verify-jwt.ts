import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()

    if (!request.user || typeof request.user.sub !== 'string') {
      console.error('JWT verified but sub claim is missing or invalid:', request.user);
      return reply.status(401).send({ message: 'Unauthorized: Invalid token payload.' });
    }

  } catch (err) {
    console.error('JWT Verification Error:', err);
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}