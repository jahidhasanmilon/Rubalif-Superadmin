"use client";

interface AddMagazineTabProps {
  active: boolean;
}

export default function AddMagazineTab({ active }: AddMagazineTabProps) {
  if (!active) return null;

  return <div />;
}
