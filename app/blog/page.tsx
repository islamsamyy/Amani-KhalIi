import type { Metadata } from "next";
import { BlogClient } from "./_components/blog-client";

export const metadata: Metadata = {
  title: "المدونة الملكية وأسرار الجمال | أماني خليل",
  description:
    "مقالات حصرية، نصائح متخصصة لعرائس الرياض، أسرار ثبات المكياج لـ 18 ساعة، وجدول العناية بالبشرة قبل ليلة الزفاف بقلم خبيرة التجميل المعتمدة دولياً أماني خليل.",
  openGraph: {
    title: "المدونة الملكية وأسرار الجمال | أماني خليل",
    description:
      "مقالات حصرية ودليل متكامل لعرائس الرياض مع خبيرة التجميل أماني خليل.",
    url: "/blog",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}

