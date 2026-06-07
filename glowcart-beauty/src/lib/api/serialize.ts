import type { Document, Types } from "mongoose";

type SerializableDoc = Document & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeDocument<T extends Record<string, unknown>>(
  doc: SerializableDoc | null
): (T & { id: string }) | null {
  if (!doc) return null;

  const plain = doc.toObject({ virtuals: true }) as T & {
    _id: Types.ObjectId;
    __v?: number;
  };

  const { _id, __v: _version, ...rest } = plain;
  void _version;

  return {
    ...rest,
    id: _id.toString(),
  } as unknown as T & { id: string };
}

export function serializeDocuments<T extends Record<string, unknown>>(
  docs: SerializableDoc[]
): Array<T & { id: string }> {
  return docs
    .map((doc) => serializeDocument<T>(doc))
    .filter((doc): doc is T & { id: string } => doc !== null);
}
