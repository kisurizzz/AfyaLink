"use client";

import ProgramDetails from "../../components/ProgramDetails";
import { useParams } from "next/navigation";

export default function ProgramDetailsPage() {
  const params = useParams();
  const programId = parseInt(params.id);

  return <ProgramDetails programId={programId} />;
}
