import * as React from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/overtrue/status-badge"

export interface InvoiceRow {
  no: string
  subject: string
  client: string
  vat: string
  created: string
  status: "paid" | "pending" | "due" | "overdue"
  statusLabel?: string
  price: string
}

export interface InvoiceTableProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  rows: InvoiceRow[]
}

export function InvoiceTable({
  title = "Invoices",
  rows,
  className,
  ...props
}: InvoiceTableProps) {
  return (
    <div className={cn("card", className)} {...props}>
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="card-body pt-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[rgba(31,41,55,0.08)] text-left">
                <th className="metric-label py-2 pr-2 font-medium">No.</th>
                <th className="metric-label py-2 pr-2 font-medium">Invoice Subject</th>
                <th className="metric-label py-2 pr-2 font-medium">Client</th>
                <th className="metric-label py-2 pr-2 font-medium">VAT No.</th>
                <th className="metric-label py-2 pr-2 font-medium">Created</th>
                <th className="metric-label py-2 pr-2 font-medium">Status</th>
                <th className="metric-label py-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.no} className="border-b border-[rgba(31,41,55,0.06)] last:border-0">
                  <td className="py-2.5 pr-2 tabular-nums">{r.no}</td>
                  <td className="py-2.5 pr-2">
                    <a href="#/" className="text-[#066fd1] hover:underline">
                      {r.subject}
                    </a>
                  </td>
                  <td className="py-2.5 pr-2">{r.client}</td>
                  <td className="py-2.5 pr-2 tabular-nums">{r.vat}</td>
                  <td className="whitespace-nowrap py-2.5 pr-2">{r.created}</td>
                  <td className="py-2.5 pr-2">
                    <StatusBadge status={r.status} label={r.statusLabel} />
                  </td>
                  <td className="py-2.5 tabular-nums">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
