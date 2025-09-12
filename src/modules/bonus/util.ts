import { Position } from "@/generated/prisma";

export function validateWeight(position: Position) {
  switch (position) {
    case Position.Chief:
      return 40;
    case Position.President:
    case Position.MD:
    case Position.VP:
    case Position.GM:
    case Position.AGM:
    case Position.MGR:
    case Position.SMGR:
      return 50;
    case Position.Foreman:
    case Position.Staff:
    case Position.Worker:
    case Position.Officer:
      return 30;
    default:
      return 30;
  }
}