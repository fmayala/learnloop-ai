// 'use server'

// import { prisma } from '@/lib/utils'

// export const createUserData = async (
//   userId: string,
//   name: string,
//   email: string
// ) => {
//   // Only create user if it doesn't exist
//   const user = await prisma.user.upsert({
//     where: { id: userId },
//     update: {},
//     create: {
//       id: userId,
//       name: name,
//       email: email
//     }
//   })

//   return user
// }
