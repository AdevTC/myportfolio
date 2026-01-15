import Hero from "@/components/Hero";
import Comments from "@/components/Comments";
import CodeActivity from "@/components/CodeActivity";

export default function Home() {
  return (
    <div className="pb-20">
      <Hero />
      <Comments />
      <CodeActivity />
    </div>
  );
}
