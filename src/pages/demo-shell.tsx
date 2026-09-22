import * as React from "react"
import { PageHeader } from "@/components/overtrue/page-header"
import { SectionCard } from "@/components/overtrue/section-card"
import type { ComponentType } from "react"

export interface DemoPageProps {
  title: string
  pretitle?: string
  breadcrumb?: string[]
  docsUrl?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

/** Thin page shell — demos only; components live under components/** */
export function DemoPage({
  title,
  pretitle,
  breadcrumb = ["Components", title],
  docsUrl,
  actions,
  children,
}: DemoPageProps) {
  return (
    <div>
      <PageHeader
        title={title}
        pretitle={pretitle ?? breadcrumb.join(" · ")}
        breadcrumb={breadcrumb}
        actions={
          actions ??
          (docsUrl ? (
            <a
              className="text-sm text-[#066fd1] hover:underline"
              href={docsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Docs
            </a>
          ) : null)
        }
      />
      {children}
    </div>
  )
}

export function demo(
  title: string,
  render: (props: { SectionCard: typeof SectionCard; DemoPage: typeof DemoPage }) => React.ReactNode,
  docsUrl?: string,
): ComponentType {
  const Page = () => <DemoPage title={title} docsUrl={docsUrl}>{render({ SectionCard, DemoPage })}</DemoPage>
  Page.displayName = `${title}Page`
  return Page
}
