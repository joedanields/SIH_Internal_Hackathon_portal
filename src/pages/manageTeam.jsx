import React, { useState, useEffect } from "react";
import { Team } from "@/entities/Team";
import { Judge } from "@/entities/Judge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, UserCheck, Settings } from "lucide-react";
import { motion } from "framer-motion";
import TeamManager from "../components/admin/TeamManager";
import JudgeManager from "../components/admin/JudgeManager";

export default function ManageTeams() {
  const [activeTab, setActiveTab] = useState("teams");
  const [teams, setTeams] = useState([]);
  const [judges, setJudges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teamsData, judgesData] = await Promise.all([
        Team.list('team_number'),
        Judge.list('name')
      ]);
      setTeams(teamsData);
      setJudges(judgesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading management tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Hackathon</h1>
        <p className="text-slate-600 mt-1">
          Add and manage teams, judges, and system settings
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("teams")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "teams"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Teams ({teams.length})
          </button>
          <button
            onClick={() => setActiveTab("judges")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "judges"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <UserCheck className="w-4 h-4 inline mr-2" />
            Judges ({judges.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "teams" && (
          <TeamManager teams={teams} onUpdate={loadData} />
        )}
        {activeTab === "judges" && (
          <JudgeManager judges={judges} onUpdate={loadData} />
        )}
      </motion.div>
    </div>
  );
}