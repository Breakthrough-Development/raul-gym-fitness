type Entity = {
  userId: string | null;
};

type AuthUser = { id: string } | null | undefined;

export const isOwner = (
  authUser: AuthUser,
  entity: Entity | null | undefined
) => {
  if (!authUser || !entity) {
    return false;
  }

  if (!entity.userId) {
    return false;
  }

  if (entity.userId !== authUser.id) {
    return false;
  }

  return true;
};
