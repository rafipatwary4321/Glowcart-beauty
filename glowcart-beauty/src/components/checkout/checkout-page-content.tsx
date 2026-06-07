"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, MapPin, Package, ShieldCheck, Tag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { routes } from "@/constants/routes";
import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/checkout/schemas";
import { formatPrice } from "@/lib/format";
import { calculateOrderTotals } from "@/lib/orders/calculate-totals";
import { DELIVERY_METHODS, PAYMENT_METHODS } from "@/lib/orders/constants";
import { createOrder, validateCheckoutCoupon } from "@/lib/orders/service";
import { useCartStore } from "@/store/cart-store";

const defaultValues: CheckoutFormValues = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddress: {
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "Dhaka",
    postalCode: "",
  },
  savedAddressId: "",
  deliveryMethod: "standard",
  paymentMethod: "cod",
  couponCode: "",
  notes: "",
};

export function CheckoutPageContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.calculateSubtotal());

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const deliveryMethod = watch("deliveryMethod");
  const paymentMethod = watch("paymentMethod");
  const couponCode = watch("couponCode");

  useEffect(() => {
    if (!session?.user) return;

    reset((current) => ({
      ...current,
      customerName: session.user.name ?? current.customerName,
      customerEmail: session.user.email ?? current.customerEmail,
      shippingAddress: {
        ...current.shippingAddress,
        name: session.user.name ?? current.shippingAddress.name,
        phone: current.shippingAddress.phone,
      },
    }));
  }, [session, reset]);

  const totals = useMemo(
    () =>
      calculateOrderTotals({
        subtotal,
        discount: couponDiscount,
        deliveryMethod,
      }),
    [subtotal, couponDiscount, deliveryMethod]
  );

  async function handleApplyCoupon() {
    if (!couponCode?.trim()) {
      toast.error("Enter a coupon code.");
      return;
    }

    setCouponLoading(true);
    try {
      const result = await validateCheckoutCoupon(couponCode.trim(), subtotal);
      setCouponDiscount(result.calculatedDiscount);
      setAppliedCoupon(result.code);
      toast.success(`Coupon ${result.code} applied.`);
    } catch (error) {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      toast.error(error instanceof Error ? error.message : "Invalid coupon.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCouponDiscount(0);
    setAppliedCoupon(null);
    setValue("couponCode", "");
  }

  async function onSubmit(values: CheckoutFormValues) {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const order = await createOrder({
        ...values,
        couponCode: appliedCoupon ?? values.couponCode,
        items: items.map((item) => ({
          productId: item.product.id,
          slug: item.product.slug,
          quantity: item.quantity,
        })),
      });

      clearCart();
      toast.success("Order placed successfully.");

      if (values.paymentMethod === "cod") {
        router.push(routes.orderSuccess(order.id));
        return;
      }

      toast.message("Payment gateway coming soon. Your order has been saved as pending.");
      router.push(routes.orderSuccess(order.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to place order.");
    }
  }

  if (items.length === 0) {
    return (
      <Card className="max-w-xl border-border/60">
        <CardHeader>
          <CardTitle>Your cart is empty</CardTitle>
          <CardDescription>Add products before checking out.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="rounded-full" asChild>
            <Link href={routes.products}>Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="size-5 text-primary" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full name" htmlFor="customerName" error={errors.customerName?.message} className="sm:col-span-2">
              <Input id="customerName" className="h-10 rounded-lg" {...register("customerName")} />
            </FormField>
            <FormField label="Email" htmlFor="customerEmail" error={errors.customerEmail?.message}>
              <Input id="customerEmail" type="email" className="h-10 rounded-lg" {...register("customerEmail")} />
            </FormField>
            <FormField label="Phone" htmlFor="customerPhone" error={errors.customerPhone?.message}>
              <Input id="customerPhone" className="h-10 rounded-lg" placeholder="+880 1XXX XXXXXX" {...register("customerPhone")} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="size-5 text-primary" />
              Shipping Address
            </CardTitle>
            <CardDescription>Saved addresses will be available in a future update.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="savedAddressId">Saved addresses</Label>
              <Select id="savedAddressId" className="h-10" disabled {...register("savedAddressId")}>
                <option value="">Use a new address</option>
                <option value="placeholder">Home — Banani, Dhaka (coming soon)</option>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Recipient name" htmlFor="shippingName" error={errors.shippingAddress?.name?.message} className="sm:col-span-2">
                <Input id="shippingName" className="h-10 rounded-lg" {...register("shippingAddress.name")} />
              </FormField>
              <FormField label="Phone" htmlFor="shippingPhone" error={errors.shippingAddress?.phone?.message}>
                <Input id="shippingPhone" className="h-10 rounded-lg" {...register("shippingAddress.phone")} />
              </FormField>
              <FormField label="Postal code" htmlFor="postalCode" error={errors.shippingAddress?.postalCode?.message}>
                <Input id="postalCode" className="h-10 rounded-lg" {...register("shippingAddress.postalCode")} />
              </FormField>
              <FormField label="Address line 1" htmlFor="line1" error={errors.shippingAddress?.line1?.message} className="sm:col-span-2">
                <Input id="line1" className="h-10 rounded-lg" {...register("shippingAddress.line1")} />
              </FormField>
              <FormField label="Address line 2" htmlFor="line2" error={errors.shippingAddress?.line2?.message} className="sm:col-span-2">
                <Input id="line2" className="h-10 rounded-lg" placeholder="Apartment, floor, landmark" {...register("shippingAddress.line2")} />
              </FormField>
              <FormField label="City" htmlFor="city" error={errors.shippingAddress?.city?.message}>
                <Input id="city" className="h-10 rounded-lg" {...register("shippingAddress.city")} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="size-5 text-primary" />
              Delivery Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {DELIVERY_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 p-4 transition-colors",
                    deliveryMethod === method.value && "border-primary bg-primary/5"
                  )}
                >
                  <input
                    type="radio"
                    value={method.value}
                    checked={deliveryMethod === method.value}
                    onChange={() =>
                      setValue("deliveryMethod", method.value, { shouldDirty: true })
                    }
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <p className="font-medium">{method.label}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="size-5 text-primary" />
              Payment Method
            </CardTitle>
            <CardDescription>Online gateways are placeholders — only COD completes immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 p-4 transition-colors",
                    paymentMethod === method.value && "border-primary bg-primary/5"
                  )}
                >
                  <input
                    type="radio"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() =>
                      setValue("paymentMethod", method.value, { shouldDirty: true })
                    }
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <p className="font-medium">{method.label}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Order Notes</CardTitle>
            <CardDescription>Optional delivery instructions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea id="notes" placeholder="Leave at reception, call before delivery..." {...register("notes")} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-border/60 xl:sticky xl:top-28">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>{items.length} item{items.length === 1 ? "" : "s"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.product.name}</p>
                    <p className="text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="shrink-0 font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="couponCode" className="flex items-center gap-2">
                <Tag className="size-4" />
                Coupon code
              </Label>
              <div className="flex gap-2">
                <Input
                  id="couponCode"
                  className="h-10 rounded-lg"
                  placeholder="GLOW10"
                  disabled={Boolean(appliedCoupon)}
                  {...register("couponCode")}
                />
                {appliedCoupon ? (
                  <Button type="button" variant="outline" className="rounded-full" onClick={removeCoupon}>
                    Remove
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={couponLoading}
                    onClick={() => void handleApplyCoupon()}
                  >
                    {couponLoading ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
                  </Button>
                )}
              </div>
              {appliedCoupon ? (
                <p className="text-xs text-emerald-600">Coupon {appliedCoupon} applied.</p>
              ) : null}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 ? (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{totals.deliveryCharge === 0 ? "Free" : formatPrice(totals.deliveryCharge)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="font-heading text-lg">{formatPrice(totals.total)}</span>
            </div>

            <Button type="submit" className="w-full rounded-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Placing order...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Place Order
                </>
              )}
            </Button>

            <Button type="button" variant="ghost" className="w-full rounded-full" asChild>
              <Link href={routes.cart}>Back to cart</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
