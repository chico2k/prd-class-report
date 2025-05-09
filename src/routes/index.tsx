import { createFileRoute } from "@tanstack/react-router";
import { FinalTable } from "@/components/Table/";

export const Route = createFileRoute("/")({
  component: FinalTable,
});
