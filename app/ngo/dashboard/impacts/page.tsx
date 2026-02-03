"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Bell,
  LogOut,
  LayoutDashboard,
  User,
  Settings,
  Scale,
  Leaf,
  Trash2,
  CloudOff,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
} from "lucide-react";
import Link from "next/link";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type ImpactApiResponse = {
    metrics: {
      food_saved: number;
      waste_prevented: number;
      co2_avoided: number;
    };
    success_rate: {
      value: number;
      completed: number;
      total: number;
    };
    monthly: {
      month: string;
      claims: number;
      completed: number;
      food_saved_kg: number;
    }[];
    categories: {
      name: string;
      value: number;
      color: string;
    }[];
  };
  

/* ------------------------------------------------------------------ */

export default function ImpactPage() {
  const [notificationCount] = useState(5);
  const [data, setData] = useState<ImpactApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Charts config */
  const claimsChartConfig = {
    claims: { label: "Total Claims", color: "hsl(25, 95%, 53%)" },
    completed: { label: "Completed Pickups", color: "hsl(142, 76%, 36%)" },
  } satisfies ChartConfig;

  const categoryChartConfig = {
    vegetables: { label: "Vegetables", color: "hsl(142, 76%, 36%)" },
    fruits: { label: "Fruits", color: "hsl(25, 95%, 53%)" },
    dairy: { label: "Dairy", color: "hsl(48, 96%, 53%)" },
    grains: { label: "Grains", color: "hsl(32, 95%, 44%)" },
    prepared: { label: "Prepared Food", color: "hsl(0, 84%, 60%)" },
  } satisfies ChartConfig;

  /* Fetch impact data */
  useEffect(() => {
    const ngoId = localStorage.getItem("ngoId"); // adjust if stored elsewhere
    if (!ngoId) {
      setError("NGO not found");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ngo/impact?ngoId=${ngoId}`)

      .then((res) => {
        if (!res.ok) throw new Error("Failed to load impact data");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading impact data…</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-destructive">{error ?? "Unable to load impact data"}</div>;
  }

  /* ------------------------------------------------------------------ */
  /* UI */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-amber-500 to-secondary p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Your Impact</h1>
                <p className="text-white/80">Track your contribution to reducing food waste</p>
              </div>
            </div>

            <Button
              className="bg-white text-primary font-semibold"
              onClick={() => (window.location.href = "/ngo/dashboard")}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-10">
          {/* KPI Cards */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              Impact Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quantity */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/10 to-primary/5">
  <CardContent className="pt-6">
    <div className="flex justify-between mb-3">
      <Scale className="w-6 h-6 text-primary" />
      <Badge className="bg-primary/20 text-primary border-0">Total</Badge>
    </div>
    <h3 className="text-sm text-muted-foreground">Food Collected</h3>
    <p className="text-3xl font-bold">
      {data.metrics.food_saved.toFixed(1)} kg
    </p>
  </CardContent>
</Card>


              {/* Food Saved */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <CardContent className="pt-6">
                  <Leaf className="w-6 h-6 text-secondary mb-2" />
                  <h3 className="text-sm text-muted-foreground">Estimated Food Saved</h3>
                  <p className="text-3xl font-bold">{data.metrics.food_saved.toFixed(1)} kg</p>
                </CardContent>
              </Card>

              {/* Waste Prevented */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                <CardContent className="pt-6">
                  <Trash2 className="w-6 h-6 text-amber-500 mb-2" />
                  <h3 className="text-sm text-muted-foreground">Waste Prevented</h3>
                  <p className="text-3xl font-bold">~{data.metrics.waste_prevented.toFixed(1)} kg</p>
                </CardContent>
              </Card>

              {/* CO2 */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                <CardContent className="pt-6">
                  <CloudOff className="w-6 h-6 text-emerald-500 mb-2" />
                  <h3 className="text-sm text-muted-foreground">CO₂ Avoided</h3>
                  <p className="text-3xl font-bold">{data.metrics.co2_avoided.toFixed(1)} kg</p>
                  <p className="text-xs text-muted-foreground">Based on 2.5kg CO₂ per kg food</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Claims Timeline */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Claims Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={claimsChartConfig} className="h-[300px]">
                  <BarChart data={data.monthly}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="claims" fill="hsl(25, 95%, 53%)" />
                    <Bar dataKey="completed" fill="hsl(142, 76%, 36%)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Top Categories Helped
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={categoryChartConfig} className="h-[300px]">
                  <RechartsPieChart>
                    <Pie
                      data={data.categories}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                    >
                      {data.categories.map((c, i) => (
                        <Cell key={i} fill={c.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </RechartsPieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

         {/* Trends Row */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
  {/* Completed Pickups Trend */}
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Completed Pickups Trend
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={claimsChartConfig} className="h-[220px]">
        <LineChart data={data.monthly}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={3}
          />
        </LineChart>
      </ChartContainer>
      <p className="text-center text-sm text-muted-foreground mt-3">
        Reliability in completing pickups
      </p>
    </CardContent>
  </Card>

  {/* Food Saved Over Time */}
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Leaf className="w-5 h-5 text-secondary" />
        Food Saved Over Time
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={claimsChartConfig} className="h-[220px]">
        <LineChart data={data.monthly}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="food_saved_kg"
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={3}
          />
        </LineChart>
      </ChartContainer>
      <p className="text-center text-sm text-muted-foreground mt-3">
        Monthly food saved (kg)
      </p>
    </CardContent>
  </Card>

  {/* Pickup Success Rate */}
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Pickup Success Rate
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center">
      <RechartsPieChart width={180} height={180}>
        <Pie
          data={[
            { name: "Success", value: data.success_rate.value },
            { name: "Remaining", value: 100 - data.success_rate.value },
          ]}
          dataKey="value"
          innerRadius={55}
          outerRadius={80}
        >
          <Cell
            fill={
              data.success_rate.value > 70
                ? "hsl(142, 76%, 36%)"
                : data.success_rate.value > 40
                ? "hsl(48, 96%, 53%)"
                : "hsl(0, 84%, 60%)"
            }
          />
          <Cell fill="hsl(215, 16%, 90%)" />
        </Pie>
      </RechartsPieChart>

      <p className="text-2xl font-bold mt-2">
        {data.success_rate.value}%
      </p>
      <p className="text-sm text-muted-foreground text-center">
        {data.success_rate.completed} / {data.success_rate.total} pickups completed
      </p>
    </CardContent>
  </Card>

</div>

          
        </div>
      </main>
    </div>
  );
}
