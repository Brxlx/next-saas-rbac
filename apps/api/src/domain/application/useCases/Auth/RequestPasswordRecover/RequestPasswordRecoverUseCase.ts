import { Token } from '@/domain/enterprise/entities/token';
import { PrismaTokensRepository } from '@/http/database/prisma/repositories/prisma-token.repository';
import { PrismaUsersRepository } from '@/http/database/prisma/repositories/prisma-users.repository';

interface AuthenticateWithPasswordUseCaseRequest {
  email: string;
}

export async function RequestPasswordRecoverUseCase({
  email,
}: AuthenticateWithPasswordUseCaseRequest): Promise<void> {
  const usersRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email,
  //   },
  // });
  const user = await usersRepository.findByEmail(email);

  if (!user) {
    return;
  }

  const { id: code } = await tokensRepository.create(
    Token.create({
      type: 'PASSWORD_RECOVER',
      userId: user.id.toString(),
    })
  );
  // const { id: code } = await prisma.token.create({
  //   data: {
  //     type: 'PASSWORD_RECOVER',
  //     userId: user.id.toString(),
  //   },
  // });

  // Send email with password recover link

  console.log('recovery token:', code.toString());
}
