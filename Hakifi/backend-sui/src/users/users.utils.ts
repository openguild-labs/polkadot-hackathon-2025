import { FRIEND_TYPE } from './type/referral.type';

export const getUserHierachyByType = (userId: string, type: FRIEND_TYPE) => {
  switch (type) {
    case FRIEND_TYPE.ALL:
      return `${userId}.*`;
    case FRIEND_TYPE.F1:
      return `${userId}`;
    case FRIEND_TYPE.F2:
      return `${userId},[a-z0-9]+`;
    case FRIEND_TYPE.F3:
      return `${userId},[a-z0-9]+,[a-z0-9]+`;
    case FRIEND_TYPE.F4:
      return `${userId},[a-z0-9]+,[a-z0-9]+,[a-z0-9]+`;
    default:
      return '';
  }
};

export const getFriendTypeByHierarchy = (hierarchy: string, userId: string) => {
  const parts = hierarchy.split(',');
  for (let i = 0; i < parts.length; i++) {
    if (parts[parts.length - i - 1] === userId) {
      return i + 1;
    }
  }
};

export const getUserLevelByTotalFriendMargin = (totalMargin: number) => {
  if (totalMargin < 20000) return 1;
  if (totalMargin < 50000) return 2;
  if (totalMargin < 100000) return 3;
  if (totalMargin < 200000) return 4;
  if (totalMargin < 400000) return 5;
  if (totalMargin < 600000) return 6;
  if (totalMargin < 800000) return 7;
  if (totalMargin < 1000000) return 8;
  return 9;
};
