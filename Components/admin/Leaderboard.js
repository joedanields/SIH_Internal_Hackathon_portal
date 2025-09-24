
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Users, Star, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard({ teams }) {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-slate-600 font-bold">{rank}</span>;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50";
    if (rank === 2) return "border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50";
    if (rank === 3) return "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50";
    return "border-slate-200";
  };

  const getScoreColor = (score) => {
    if (score >= 150) return "text-green-600";
    if (score >= 100) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-slate-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border rounded-xl ${getRankStyle(index + 1)} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index + 1)}
                    <Badge variant="outline">Team {team.team_number}</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{team.team_name}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <div className="flex items-center gap-1"><Users className="w-3 h-3" /> {team.members?.length || 0} members</div>
                      <div className="flex items-center gap-1"><Star className="w-3 h-3" /> {team.judgeCount} judges</div>
                      <div className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> {team.ideasScoredCount} ideas scored</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(team.finalScore)}`}>
                    {team.finalScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-500">final score</div>
                </div>
              </div>
            </motion.div>
          ))}

          {teams.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No teams registered yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
