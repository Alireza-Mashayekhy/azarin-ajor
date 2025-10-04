import Script from 'next/script';

interface BreadcrumbItem {
  name: string;
  item?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  id?: string;
}

export default function BreadcrumbSchema({
  items,
  id = 'json-ld-breadcrumb',
}: BreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((listItem, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: listItem.name,
      ...(listItem.item ? { item: listItem.item } : {}),
    })),
  } as const;

  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
