import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
} from '@casl/ability';

const actions = ['manage', 'invite', 'delete'] as const;
const subjects = ['User', 'all'] as const;

type AppAbilities = [
  (typeof actions)[number],
  (typeof subjects)[number] | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>,
];

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

// Create CASL builder
const { build, can, cannot } = new AbilityBuilder(createAppAbility);

// Define permissions
can('invite', 'User');
// Redundant, as permissions are false by default unless specified
cannot('delete', 'User');

export const ability = build();
