import { defineAbilityFor, projectSchema } from '@saas/auth';

const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-01' });

const project = projectSchema.parse({ id: 'project-01', ownerId: 'user-02' });

console.log(ability.can('get', 'Billing'));
console.log(ability.can('create', 'Invite'));
// Can delete SOME Project (including some that user is owner)
console.log(ability.can('delete', 'Project'));
// Can delete SPECIFIC project(whose user is not owner)
console.log(ability.can('delete', project));
