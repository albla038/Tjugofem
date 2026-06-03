import { Spinner } from "@/components/ui/spinner";

export default function CategoryLoader() {
  return (
    <main className="flex h-[calc(100svh-70px)] items-center justify-center">
      <Spinner className="size-8" />
    </main>
  );
}
