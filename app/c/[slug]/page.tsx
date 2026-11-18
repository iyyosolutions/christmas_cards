import { redirect } from "next/navigation";

export default async function LegacyCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/card/${slug}`);
}
