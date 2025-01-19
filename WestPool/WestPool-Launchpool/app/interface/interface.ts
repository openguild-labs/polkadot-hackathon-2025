import { Decimal } from "@prisma/client/runtime/library";

export interface Project {
  id: string;
  projectName: string;
  projectOwnerAddress: string;
  verifiedTokenAddress: string;
  tokenSymbol: string;
  projectLogo: string;
  projectImage: string[];
  shortDescription: string;
  longDescription: string;
  acceptedVToken: string[];
  minStake: Decimal;
  maxStake: Decimal;
  fromDate: Date;
  toDate: Date;
  txHashCreated: string;
  projectStatus: string;
  chainName: string;
  poolBudget: Decimal;
  targetStake: Decimal;
  projectOwner: ProjectOwner;
  userId?: string;
  offers: Offer[];
  invested: InvestedProject[];
  apr?: number;
  totalStaked?: number;
  userClaimReward?: number;
}

export interface User {
  id: string;
  userAddress: string;
  offers: UserOffer[];
  invested: InvestedProject[];
  ProjectOwner: ProjectOwner[];
  projects?: Project[];
  offerId?: string;
}

export interface ProjectOwner {
  id: string;
  userAddress: string;
  User: User;
  Project: Project[];
}

export interface Offer {
  id: string;
  pricePerToken: Decimal;
  index: number;
  amount: Decimal;
  collateral: Decimal;
  tokenPreTokenAddress: string;
  tokenCollateralAddress: string;
  txHash: string;
  offerType: OfferType;
  startDate: Date;
  filledTime: Date;
  creatorStatus: CreateOfferStatus;
  fillerStatus: FillerOfferStatus;
  creatorAddress: string;
  fillerAddress: string;
  projectId: string;
  project: Project;
  users: UserOffer[];
}

export interface UserOffer {
  userId: string;
  offerId: string;
  User: User;
  Offer: Offer;
}

export interface InvestedProject {
  userId: string;
  projectId: string;
  User: User;
  Project: Project;
}

export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  address: string;
}

export interface Launchpool {
  id: string;
  totalProject: number;
  uniqueParticipants: number;
  totalTx: number;
}

export enum ProjectStatus {
  Upcoming,
  Ongoing,
  Completed,
}

export enum CreateOfferStatus {
  Open = "Open",
  Pending = "Pending",
  Settled = "Settled",
  Canceled = "Canceled",
  CanceledWithdraw = "CanceledWithdraw",
  Closed = "Closed",
}

export enum FillerOfferStatus {
  NotYet = "NotYet",
  Pending = "Pending",
  Completed = "Completed",
  Canceled = "Canceled",
  CanceledWithdraw = "CanceledWithdraw",
}

export enum OfferType {
  Buy = "Buy",
  Sell = "Sell",
}
