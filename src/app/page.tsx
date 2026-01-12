import Hero from "@/components/Hero";
import Comments from "@/components/Comments";
import CodeActivity from "@/components/CodeActivity";
import CodeActivityModal from "@/components/CodeActivityModal";

export default function Home() {
  return (
    <div className="pb-20">
      <Hero />
      <Comments />
      <CodeActivity />
      <CodeActivityModal />
    </div>
  );
}
