import * as React from "react";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";

export function PageHeader({
  breadcrumb,
  title,
  subtitle,
  actions,
}: {
  breadcrumb?: BreadcrumbItem[];
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-[22px]">
      {breadcrumb && breadcrumb.length > 0 ? (
        <div className="mb-3">
          <Breadcrumb items={breadcrumb} />
        </div>
      ) : null}
      <div className="adm-pagehead">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
