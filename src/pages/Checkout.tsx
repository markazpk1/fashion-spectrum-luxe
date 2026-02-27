import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Lock, Truck, CreditCard, User, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";

const shippingSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(7, "Valid phone number required").max(20),
  address: z.string().trim().min(5, "Address is required").max(200),
  apartment: z.string().trim().max(100).optional(),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  zip: z.string().trim().min(3, "ZIP code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(100),
});

const accountSchema = z.object({
  createAccount: z.boolean(),
  password: z.string().min(6, "Password must be at least 6 characters").max(100).optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.createAccount && !data.password) return false;
  return true;
}, { message: "Password is required", path: ["password"] })
.refine((data) => {
  if (data.createAccount && data.password !== data.confirmPassword) return false;
  return true;
}, { message: "Passwords do not match", path: ["confirmPassword"] });

const paymentSchema = z.object({
  cardNumber: z.string().trim().min(13, "Valid card number required").max(19),
  cardName: z.string().trim().min(1, "Cardholder name is required").max(100),
  expiry: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  cvv: z.string().trim().min(3, "Valid CVV required").max(4),
});

type ShippingForm = z.infer<typeof shippingSchema>;
type PaymentForm = z.infer<typeof paymentSchema>;

const initialShipping: ShippingForm = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", apartment: "", city: "", state: "", zip: "", country: "United States",
};

const initialPayment: PaymentForm = {
  cardNumber: "", cardName: "", expiry: "", cvv: "",
};

const SHIPPING_COST = 15;
const FREE_SHIPPING_THRESHOLD = 300;
const TAX_RATE = 0.08;

type Step = "shipping" | "payment" | "confirmation";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<ShippingForm>(initialShipping);
  const [payment, setPayment] = useState<PaymentForm>(initialPayment);
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<Step>("shipping");

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = +(totalPrice * TAX_RATE).toFixed(2);
  const grandTotal = totalPrice + shipping + tax;

  const updateField = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updatePaymentField = (field: keyof PaymentForm, value: string) => {
    // Format card number with spaces
    if (field === "cardNumber") {
      value = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
    }
    // Format expiry
    if (field === "expiry") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
      else value = value.slice(0, 2);
    }
    // Format CVV
    if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }
    setPayment((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shippingResult = shippingSchema.safeParse(form);
    const newErrors: Record<string, string> = {};

    if (!shippingResult.success) {
      shippingResult.error.errors.forEach((err) => {
        const key = err.path[0] as string;
        if (!newErrors[key]) newErrors[key] = err.message;
      });
    }

    if (createAccount) {
      const accountResult = accountSchema.safeParse({ createAccount, password, confirmPassword });
      if (!accountResult.success) {
        accountResult.error.errors.forEach((err) => {
          const key = err.path[0] as string;
          if (!newErrors[key]) newErrors[key] = err.message;
        });
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCard = payment.cardNumber.replace(/\s/g, "");
    const result = paymentSchema.safeParse({ ...payment, cardNumber: cleanCard });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as string;
        if (!newErrors[key]) newErrors[key] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (createAccount) {
      localStorage.setItem("fs-user", JSON.stringify({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
      }));
    }
    clearCart();
    setStep("confirmation");
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-background pb-mobile-nav">
        <AnnouncementBar />
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <h1 className="font-heading text-4xl text-foreground mb-4">Your cart is empty</h1>
          <p className="font-body text-sm text-muted-foreground mb-8">Add some items before checking out.</p>
          <Link to="/" className="font-body text-xs tracking-[0.2em] uppercase bg-primary text-primary-foreground px-8 py-4 hover:bg-charcoal transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (step === "confirmation" && items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-mobile-nav">
        <AnnouncementBar />
        <Navbar />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Lock className="text-primary" size={28} />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-3">Order Confirmed</h1>
          <p className="font-body text-sm text-muted-foreground mb-2 max-w-md">
            Thank you for your order! A confirmation email has been sent to <strong className="text-foreground">{form.email}</strong>.
          </p>
          <p className="font-body text-xs text-muted-foreground mb-8">
            Order total: <strong className="text-foreground">${grandTotal.toFixed(2)}</strong>
          </p>
          <Link to="/" className="font-body text-xs tracking-[0.2em] uppercase bg-primary text-primary-foreground px-8 py-4 hover:bg-charcoal transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const InputField = ({ label, field, type = "text", required = true, colSpan = false, value, onChange }: {
    label: string; field: string; type?: string; required?: boolean; colSpan?: boolean;
    value: string; onChange: (val: string) => void;
  }) => (
    <div className={colSpan ? "md:col-span-2" : ""}>
      <label className="block font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
        {label} {required && <span className="text-sale">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
          errors[field] ? "border-sale focus:border-sale" : "border-border focus:border-primary"
        }`}
        placeholder={label}
      />
      {errors[field] && <p className="font-body text-[10px] text-sale mt-1">{errors[field]}</p>}
    </div>
  );

  const steps: { icon: typeof Truck; label: string; key: Step }[] = [
    { icon: User, label: "Shipping", key: "shipping" },
    { icon: CreditCard, label: "Payment", key: "payment" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <AnnouncementBar />
      <Navbar />

      <div className="px-6 md:px-16 py-4">
        <Link to="/" className="inline-flex items-center gap-1 font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div className="px-6 md:px-16 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-5 gap-10 md:gap-16 max-w-7xl mx-auto">

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-8">Checkout</h1>

            {/* Progress */}
            <div className="flex items-center gap-4 mb-10">
              {steps.map(({ icon: Icon, label, key }, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    <Icon size={14} />
                  </div>
                  <span className={`font-body text-xs tracking-wider uppercase ${
                    i <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {label}
                  </span>
                  {i < steps.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
                </div>
              ))}
            </div>

            {/* SHIPPING STEP */}
            {step === "shipping" && (
              <motion.form
                key="shipping"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleShippingSubmit}
                className="space-y-8"
              >
                {/* Contact */}
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">Contact Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Email" field="email" type="email" colSpan value={form.email} onChange={(v) => updateField("email", v)} />
                    <InputField label="Phone" field="phone" type="tel" colSpan value={form.phone} onChange={(v) => updateField("phone", v)} />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">Shipping Address</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="First Name" field="firstName" value={form.firstName} onChange={(v) => updateField("firstName", v)} />
                    <InputField label="Last Name" field="lastName" value={form.lastName} onChange={(v) => updateField("lastName", v)} />
                    <InputField label="Address" field="address" colSpan value={form.address} onChange={(v) => updateField("address", v)} />
                    <InputField label="Apartment, suite, etc." field="apartment" required={false} colSpan value={form.apartment || ""} onChange={(v) => updateField("apartment", v)} />
                    <InputField label="City" field="city" value={form.city} onChange={(v) => updateField("city", v)} />
                    <InputField label="State / Province" field="state" value={form.state} onChange={(v) => updateField("state", v)} />
                    <InputField label="ZIP / Postal Code" field="zip" value={form.zip} onChange={(v) => updateField("zip", v)} />
                    <InputField label="Country" field="country" value={form.country} onChange={(v) => updateField("country", v)} />
                  </div>
                </div>

                {/* Create Account */}
                <div className="border border-border p-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => {
                        setCreateAccount(e.target.checked);
                        if (!e.target.checked) {
                          setPassword("");
                          setConfirmPassword("");
                          setErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }));
                        }
                      }}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="font-body text-sm text-foreground">Create an account for faster checkout next time</span>
                  </label>
                  {createAccount && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 grid md:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
                          Password <span className="text-sale">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                            }}
                            className={`w-full bg-transparent border px-4 py-3 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                              errors.password ? "border-sale focus:border-sale" : "border-border focus:border-primary"
                            }`}
                            placeholder="Min. 6 characters"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.password && <p className="font-body text-[10px] text-sale mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <label className="block font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
                          Confirm Password <span className="text-sale">*</span>
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                          }}
                          className={`w-full bg-transparent border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                            errors.confirmPassword ? "border-sale focus:border-sale" : "border-border focus:border-primary"
                          }`}
                          placeholder="Re-enter password"
                        />
                        {errors.confirmPassword && <p className="font-body text-[10px] text-sale mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase py-4 hover:bg-charcoal transition-colors duration-300 active:scale-[0.99]"
                >
                  Continue to Payment
                </button>
              </motion.form>
            )}

            {/* PAYMENT STEP */}
            {step === "payment" && (
              <motion.form
                key="payment"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePaymentSubmit}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">Payment Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Card Number" field="cardNumber" colSpan value={payment.cardNumber} onChange={(v) => updatePaymentField("cardNumber", v)} />
                    <InputField label="Cardholder Name" field="cardName" colSpan value={payment.cardName} onChange={(v) => updatePaymentField("cardName", v)} />
                    <InputField label="Expiry (MM/YY)" field="expiry" value={payment.expiry} onChange={(v) => updatePaymentField("expiry", v)} />
                    <InputField label="CVV" field="cvv" value={payment.cvv} onChange={(v) => updatePaymentField("cvv", v)} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep("shipping"); setErrors({}); }}
                    className="flex-1 border border-border text-foreground font-body text-xs tracking-[0.2em] uppercase py-4 hover:bg-secondary transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase py-4 hover:bg-charcoal transition-colors duration-300 active:scale-[0.99]"
                  >
                    Place Order — ${grandTotal.toFixed(2)}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Lock size={14} />
                  <span className="font-body text-[10px] tracking-wider">Secure & encrypted checkout</span>
                </div>
              </motion.form>
            )}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-28 bg-secondary/50 p-6 md:p-8">
              <h2 className="font-heading text-xl text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 bg-charcoal text-primary-foreground text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-body">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body text-[10px] tracking-[0.1em] uppercase text-foreground truncate">{item.product.name}</h3>
                      <p className="font-body text-[9px] text-muted-foreground mt-0.5">Size: {item.size}</p>
                      <p className="font-body text-xs font-medium text-foreground mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between font-body text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body text-xs text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-primary font-medium" : "text-foreground"}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-body text-xs text-muted-foreground">
                  <span>Tax (est.)</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="font-body text-xs tracking-[0.15em] uppercase text-foreground">Total</span>
                  <span className="font-heading text-xl text-foreground">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {totalPrice < FREE_SHIPPING_THRESHOLD && (
                <div className="mt-4 bg-background p-3 text-center">
                  <p className="font-body text-[10px] text-muted-foreground">
                    Add <strong className="text-primary">${(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(2)}</strong> more for free shipping
                  </p>
                  <div className="w-full bg-border h-1 mt-2 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
