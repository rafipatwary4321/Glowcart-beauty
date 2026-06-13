import type { Document, Types } from "mongoose";

type SerializableDoc = Document & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeDocument<T extends Record<string, unknown>>(
  doc: SerializableDoc | (Record<string, unknown> & { _id?: Types.ObjectId | string }) | null
): (T & { id: string }) | null {
  if (!doc) return null;

  const plain = (
    typeof (doc as SerializableDoc).toObject === "function"
      ? (doc as SerializableDoc).toObject({ virtuals: true })
      : doc
  ) as T & {
    _id: Types.ObjectId;
    __v?: number;
  };

  const { _id, __v: _version, ...rest } = plain;
  void _version;

  const id =
    _id != null
      ? String(_id)
      : (plain as { id?: string }).id != null
        ? String((plain as { id?: string }).id)
        : "";

  if (!id) return null;

  return {
    ...rest,
    id,
  } as unknown as T & { id: string };
}

export function serializeDocuments<T extends Record<string, unknown>>(
  docs: Array<SerializableDoc | Record<string, unknown>>
): Array<T & { id: string }> {
  return docs
    .map((doc) => serializeDocument<T>(doc))
    .filter((doc): doc is T & { id: string } => doc !== null);
}
