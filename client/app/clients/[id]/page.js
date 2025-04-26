"use client";

import ClientDetails from "../../components/ClientDetails";
import { useParams } from "next/navigation";

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = parseInt(params.id);

  return <ClientDetails clientId={clientId} />;
}
