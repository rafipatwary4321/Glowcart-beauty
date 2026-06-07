import type { Session } from "next-auth";

import { UserAvatar } from "@/components/profile/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ProfileHeaderProps = {
  session: Session;
};

export function ProfileHeader({ session }: ProfileHeaderProps) {
  const user = session.user;

  return (
    <Card className="border-border/60 bg-background/80">
      <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
        <UserAvatar name={user.name} image={user.image} size="lg" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-xl font-medium text-foreground">
              {user.name ?? "GlowCart Member"}
            </h2>
            <Badge variant="outline" className="capitalize">
              {user.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">
            Member since 2026 · Placeholder profile data
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
