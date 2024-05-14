import { ability } from '@saas/auth';

const userCanInviteSomeoneElse = ability.can('invite', 'User');
const userCanDeleteOtherUser = ability.can('delete', 'User');
const userCannotDeleteOtherUser = ability.cannot('delete', 'User');

console.log(userCanInviteSomeoneElse, userCanDeleteOtherUser, userCannotDeleteOtherUser);
