
import '@/styles/breadcrumb.css'; // Adjust path
import React from 'react';

const microData = {
  ol: {
    itemScope: true,
    itemType: 'http://schema.org/BreadcrumbList',
  },
  li: {
    itemProp: 'itemListElement',
    itemScope: true,
    itemType: 'http://schema.org/ListItem',
  },
  span: {
    itemProp: 'name',
  },
};

interface Breadcrumb {
  href: string,
  label: string
}

interface BreadcrumbProps {
  breadcrumbs: Breadcrumb[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs = [] }) => {
  return (
    <ol className="ht-breadcrumbs" {...microData.ol} aria-label="Breadcrumb">
      {breadcrumbs.map((breadcrumb, i) => {
        return (
          <li key={i} {...microData.li}>
            <a href={breadcrumb.href}>
              {breadcrumb.href === '/' && <HomeIcon />}
              <span {...microData.span}>{breadcrumb.label}</span>
            </a>
            <meta itemProp="position" content={(i + 1).toString()} />
          </li>
        );
      })}
    </ol>
  );
};

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      style={{ width: '18px', height: 18 }}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
};


export default Breadcrumb;