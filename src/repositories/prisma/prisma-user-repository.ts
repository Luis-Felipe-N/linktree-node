import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRepository } from "../user-repository";

export class PrismaUsersRepository implements UserRepository {
  async create(data: Prisma.UserUncheckedCreateInput){
    const user = await prisma.user.create({
      data: data
    })

    return user
  }
  
}