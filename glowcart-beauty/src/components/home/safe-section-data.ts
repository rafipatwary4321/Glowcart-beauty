type Identifiable = {
  id?: string;
  slug?: string;
};

export function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function stableItemKey(item: Identifiable, index: number, prefix: string): string {
  return item.id ?? item.slug ?? `${prefix}-${index}`;
}

export function filterRenderable<T extends Identifiable>(items: T[]): T[] {
  return asArray(items).filter((item) => Boolean(item?.id || item?.slug));
}
