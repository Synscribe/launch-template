import { ProjectVisual } from "@/components/visuals/project-visual";
import type { UseCaseVisualId } from "@/lib/use-cases";

export function UseCaseVisual({
  id,
  priority = false,
}: {
  id: UseCaseVisualId;
  priority?: boolean;
}) {
  return <ProjectVisual id={id} priority={priority} />;
}
