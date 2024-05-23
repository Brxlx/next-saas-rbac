import { env } from '@saas/env';
import { z } from 'zod';

import { User } from '@/domain/enterprise/entities/user';
import { PrismaUsersRepository } from '@/http/database/prisma/repositories/prisma-users.repository';
import { prisma } from '@/lib/prisma';

import { ApiError } from '../errors/apiError';

interface AuthenticateWithGithubUseCaseRequest {
  code: string;
}

export async function AuthenticateWithGithubUseCase({
  code,
}: AuthenticateWithGithubUseCaseRequest) {
  // const userPresenter = new UserPresenter();
  const usersRepository = new PrismaUsersRepository();

  const githubOAuthURL = new URL(env.GITHUB_OAUTH_URL);

  githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
  githubOAuthURL.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET);
  githubOAuthURL.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_SECRET);
  githubOAuthURL.searchParams.set('code', code);

  const githubAccessTokenResponse = await fetch(githubOAuthURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  }).then((resp) => resp.json());

  console.log(githubAccessTokenResponse);

  // {
  //   access_token: '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',
  //   token_type: 'bearer',
  //   scope: 'user:email'
  // }

  const { access_token: accessToken } = z
    .object({
      access_token: z.string(),
      token_type: z.literal('bearer'),
      scope: z.string(),
    })
    .parse(githubAccessTokenResponse);

  const githubUserResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((resp) => resp.json());

  console.log(githubUserResponse);

  const {
    id: githubId,
    name,
    email,
    avatar_url: avatarUrl,
  } = z
    .object({
      id: z.number().int().transform(String),
      avatar_url: z.string().url(),
      name: z.string().nullable(),
      email: z.string().nullable(),
    })
    .parse(githubUserResponse);

  if (!email) throw new ApiError('User email not found', 400);

  let user = await usersRepository.findByEmail(email);

  if (!user) {
    const domainUser = User.create({ name, email, avatarUrl });
    await usersRepository.create(domainUser);
    user = domainUser;
  }

  // TODO: refactor to repository pattern
  let account = await prisma.account.findUnique({
    where: {
      provider_userId: {
        provider: 'GITHUB',
        userId: user?.id.toString(),
      },
    },
  });

  if (!account) {
    account = await prisma.account.create({
      data: {
        provider: 'GITHUB',
        providerAccountId: githubId,
        userId: user.id.toString(),
      },
    });
  }

  return { user };
}
