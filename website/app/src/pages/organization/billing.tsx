"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  FileText,
  LineChart,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function Billing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any>([
    { id: 1, type: "Visa", last4: "1234", expiry: "12/2025", isDefault: true },
    {
      id: 2,
      type: "Mastercard",
      last4: "5678",
      expiry: "06/2026",
      isDefault: false,
    },
    { id: 3, type: "PayPal", email: "user@example.com", isDefault: false },
  ]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "credit_card",
    cardNumber: "",
    expiry: "",
    cvv: "",
    email: "",
  });

  const pricingPlans = [
    {
      name: "Basic",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: ["10 GB Storage", "2 Users", "Basic Support"],
    },
    {
      name: "Pro",
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      features: [
        "100 GB Storage",
        "10 Users",
        "Priority Support",
        "Advanced Analytics",
      ],
      recommended: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: 99.99,
      annualPrice: 999.99,
      features: [
        "Unlimited Storage",
        "Unlimited Users",
        "24/7 Support",
        "Custom Solutions",
      ],
    },
  ];

  const handleAddPaymentMethod = () => {
    const newId = Math.max(...paymentMethods.map((pm: any) => pm.id)) + 1;
    const newMethod = {
      id: newId,
      type: newPaymentMethod.type === "credit_card" ? "Visa" : "PayPal",
      last4:
        newPaymentMethod.type === "credit_card"
          ? newPaymentMethod.cardNumber.slice(-4)
          : undefined,
      expiry:
        newPaymentMethod.type === "credit_card"
          ? newPaymentMethod.expiry
          : undefined,
      email:
        newPaymentMethod.type === "paypal" ? newPaymentMethod.email : undefined,
      isDefault: false,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setNewPaymentMethod({
      type: "credit_card",
      cardNumber: "",
      expiry: "",
      cvv: "",
      email: "",
    });
  };

  const handleDeletePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter((pm: any) => pm.id !== id));
  };

  const handleSetDefaultPaymentMethod = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((pm: any) => ({ ...pm, isDefault: pm.id === id }))
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1 justify-center">
        <h1 className="text-2xl font-bold">Subscription & Billing</h1>
        <h3 className="text-sm text-muted-foreground">
          Manage your subscription and billing details.
        </h3>
      </div>
      <Tabs defaultValue="plan" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plan">Current Plan</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="topup">Top-up</TabsTrigger>
        </TabsList>
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the Pro plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$49.99 / month</div>
              <p className="text-sm text-muted-foreground mt-2">
                Next billing date: November 1, 2024
              </p>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Upgrade Plan</Button>
            </CardFooter>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pricing Plans</CardTitle>
              <CardDescription>Compare our pricing plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end items-center space-x-2 mb-4">
                <span className="text-sm">Monthly</span>
                <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
                <span className="text-sm">Annual</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {pricingPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className={plan.recommended ? "border-primary" : ""}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {plan.name}
                        {plan.recommended && (
                          <Badge variant="secondary">
                            <Star className="h-4 w-4 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        <span className="text-3xl font-bold">
                          $
                          {isAnnual
                            ? plan.annualPrice.toFixed(2)
                            : plan.monthlyPrice.toFixed(2)}
                        </span>
                        {isAnnual ? " / year" : " / month"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>{feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={plan.recommended ? "default" : "outline"}
                      >
                        {plan.recommended ? "Upgrade to Pro" : "Choose Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method: any) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {method.type === "PayPal" ? (
                      <CreditCard className="h-6 w-6 text-blue-500" />
                    ) : (
                      <CreditCard className="h-6 w-6" />
                    )}
                    <div>
                      <p className="font-medium">
                        {method.type}{" "}
                        {method.last4 ? `ending in ${method.last4}` : ""}
                        {method.isDefault && (
                          <Badge className="ml-2">Default</Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {method.expiry
                          ? `Expires ${method.expiry}`
                          : method.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    >
                      Set as Default
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Payment Method</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Enter your payment details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="payment-type">Payment Type</Label>
                      <Select
                        value={newPaymentMethod.type}
                        onValueChange={(value) =>
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger id="payment-type">
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newPaymentMethod.type === "credit_card" ? (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input
                            id="card-number"
                            value={newPaymentMethod.cardNumber}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                cardNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            value={newPaymentMethod.expiry}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                expiry: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={newPaymentMethod.cvv}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                cvv: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="paypal-email">PayPal Email</Label>
                        <Input
                          id="paypal-email"
                          type="email"
                          value={newPaymentMethod.email}
                          onChange={(e) =>
                            setNewPaymentMethod({
                              ...newPaymentMethod,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddPaymentMethod}>
                      Add Payment Method
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "2024-10-01",
                    amount: "$49.99",
                    description: "Monthly subscription",
                  },
                  {
                    date: "2024-09-01",
                    amount: "$49.99",
                    description: "Monthly subscription",
                  },
                  {
                    date: "2024-08-01",
                    amount: "$49.99",
                    description: "Monthly subscription",
                  },
                ].map((transaction, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                    <div className="font-medium">{transaction.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-10-01", amount: "$49.99", id: "INV-001" },
                  { date: "2024-09-01", amount: "$49.99", id: "INV-002" },
                  { date: "2024-08-01", amount: "$49.99", id: "INV-003" },
                ].map((invoice, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{invoice.amount}</span>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="topup">
          <Card>
            <CardHeader>
              <CardTitle>Top-up</CardTitle>
              <CardDescription>
                Manage your account balance and auto-recharge settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="balance">Current Balance</Label>
                <div className="text-2xl font-bold">$250.00</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topup-amount">Top-up Amount</Label>
                <div className="flex space-x-2">
                  <Input
                    id="topup-amount"
                    placeholder="Enter amount"
                    type="number"
                  />
                  <Button>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Add Funds
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-recharge"
                  checked={autoRecharge}
                  onCheckedChange={setAutoRecharge}
                />
                <Label htmlFor="auto-recharge">Enable Auto-recharge</Label>
              </div>
              {autoRecharge && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Recharge Threshold</Label>
                    <Input
                      id="threshold"
                      placeholder="Enter threshold amount"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Recharge Amount</Label>
                    <Input
                      min={10}
                      id="recharge-amount"
                      placeholder="Enter recharge amount"
                      type="number"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Usage Graph</CardTitle>
              <CardDescription>
                Your usage over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Usage graph placeholder
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
