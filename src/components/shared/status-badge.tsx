import React from "react";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/donation.types";
import { AssistanceStatus } from "@/types/assistance.types";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "PAID":
      return <Badge variant="success">Pembayaran Berhasil</Badge>;
    case "PENDING":
      return <Badge variant="warning">Menunggu Pembayaran</Badge>;
    case "EXPIRED":
      return <Badge variant="outline">Kedaluwarsa</Badge>;
    case "FAILED":
      return <Badge variant="danger">Pembayaran Gagal</Badge>;
    case "CANCELLED":
      return <Badge variant="outline">Dibatalkan</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function AssistanceStatusBadge({ status }: { status: AssistanceStatus }) {
  switch (status) {
    case "APPROVED":
    case "DISTRIBUTED":
      return <Badge variant="success">Disetujui / Disalurkan</Badge>;
    case "IN_REVIEW":
    case "DOCUMENT_REVIEW":
    case "VERIFIED":
      return <Badge variant="warning">Sedang Diproses</Badge>;
    case "SUBMITTED":
      return <Badge variant="secondary">Pengajuan Diterima</Badge>;
    case "NEEDS_REVISION":
      return <Badge variant="warning">Perlu Revisi Dokumen</Badge>;
    case "REJECTED":
      return <Badge variant="danger">Tidak Disetujui</Badge>;
    case "CLOSED":
      return <Badge variant="outline">Selesai</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
