import { env } from '@saas/env';
import { z } from 'zod';

import { EntityId } from '@/core/entities/entity-id';
import { ProvidersEnum } from '@/core/repositories/account-provider-params';
import { Account } from '@/domain/enterprise/entities/account';
import { User } from '@/domain/enterprise/entities/user';
import { PrismaAccountsRepository } from '@/http/database/prisma/repositories/prisma-accounts.repository';
import { PrismaUsersRepository } from '@/http/database/prisma/repositories/prisma-users.repository';

import { ApiError } from '../errors/apiError';

interface AuthenticateWithGithubUseCaseRequest {
  code: string;
}

export async function AuthenticateWithGithubUseCase({
  code,
}: AuthenticateWithGithubUseCaseRequest) {
  // const userPresenter = new UserPresenter();
  const usersRepository = new PrismaUsersRepository();
  const accountsRepository = new PrismaAccountsRepository();

  const githubOAuthURL = new URL(env.GITHUB_OAUTH_URL);

  githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
  githubOAuthURL.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET);
  githubOAuthURL.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI);
  githubOAuthURL.searchParams.set('code', code);

  const githubAccessTokenResponse = await fetch(githubOAuthURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  }).then((resp) => resp.json());

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

  const account = await accountsRepository.findOneByProviderAnduserId(
    {
      provider: ProvidersEnum.GITHUB,
      userId: user.id.toString(),
    },
    { select: { id: true, provider: true, providerAccountId: true } }
  );

  if (!account) {
    const accountDomain = Account.create({
      provider: ProvidersEnum.GITHUB,
      userId: user.id,
      providerAccountId: new EntityId(githubId),
    });

    await accountsRepository.create(accountDomain);
  }

  return { user };
}
