import type { Metadata } from "next";
import { BlogPostClient } from "./_components/blog-post-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `مقال في المدونة الملكية | أماني خليل`,
    description: `نصائح حصرية لعرائس الرياض ومحبات الجمال مع خبيرة التجميل المعتمدة دولياً أماني خليل.`,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}

