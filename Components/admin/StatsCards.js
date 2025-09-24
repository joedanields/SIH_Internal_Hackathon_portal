import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const colorVariants = {
  blue: {
    bg: "bg-blue-500",
    lightBg: "bg-blue-50",
    text: "text-blue-600"
  },
  green: {
    bg: "bg-green-500",
    lightBg: "bg-green-50", 
    text: "text-green-600"
  },
  purple: {
    bg: "bg-purple-500",
    lightBg: "bg-purple-50",
    text: "text-purple-600"
  },
  amber: {
    bg: "bg-amber-500",
    lightBg: "bg-amber-50",
    text: "text-amber-600"
  }
};

export default function StatsCards({ title, value, icon: Icon, color = "blue" }) {
  const colors = colorVariants[color];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} opacity-10 rounded-full transform translate-x-6 -translate-y-6`} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${colors.lightBg}`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}