import { Card, CardContent, CardHeader, CardTitle, Text } from "@repo/design-system";
import type { StatCardProps } from "../types";

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <Text variant="muted" size="xs">
            {description}
          </Text>
        )}
      </CardContent>
    </Card>
  );
}
