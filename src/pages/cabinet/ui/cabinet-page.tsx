import Layout from "@/src/app/layouts/layout";
import PersonalCabinet from "./personal-cabinet";
import CabinetSkeleton from "@/src/pages/cabinet/ui/cabinet-skeleton";
import { Suspense } from "react";

export function CabinetPage() {
  return (
    <Layout>
      <PersonalCabinet />
    </Layout>
  );
}
