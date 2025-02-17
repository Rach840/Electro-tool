import { Badge } from "./badge";

export default function DeliverBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={
        status === "DELIVERED"
          ? "bg-green-100 text-green-800 text-lg"
          : status === "PROCESSED"
            ? "bg-blue-100 text-blue-800 text-lg"
            : "bg-red-100 text-red-800 text-lg"
      }
    >
      {status === "DELIVERED"
        ? "Доставлен"
        : status === "PROCESSED"
          ? "В пути"
          : "Не доставлен"}
    </Badge>
  );
}
