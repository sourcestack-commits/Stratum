import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useCadProjects() {
  const { cad } = useServices();
  return useQuery({ queryKey: ["cad", "projects"], queryFn: () => cad.listProjects() });
}

export function useCadProject(id: string) {
  const { cad } = useServices();
  return useQuery({
    queryKey: ["cad", "project", id],
    queryFn: () => cad.getProject(id),
    enabled: !!id,
  });
}
