import { placeholderAddresses } from "@/data/placeholder-addresses";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddressList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {placeholderAddresses.map((address) => (
        <Card key={address.id} className="border-border/60">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">{address.label}</CardTitle>
            {address.isDefault ? <Badge>Default</Badge> : null}
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{address.name}</p>
            <p>{address.phone}</p>
            <p>{address.line1}</p>
            {address.line2 ? <p>{address.line2}</p> : null}
            <p>
              {address.city}, {address.postalCode}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
