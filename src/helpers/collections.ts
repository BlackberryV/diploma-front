import { CollectionStatus } from "@/api/common";

export const getStatusChipColor = (status: CollectionStatus) => {
  switch (status) {
    case CollectionStatus.CLOSED:
      return "default";
    case CollectionStatus.REJECTED:
      return "error";
    case CollectionStatus.PUBLISHED:
      return "success";
    case CollectionStatus.PENDING:
      return "warning";
    default:
      return "default";
  }
};
