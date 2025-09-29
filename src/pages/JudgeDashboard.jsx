
import React, { useState, useEffect } from "react";
import { Team } from "@/entities/Team";
import { Score } from "@/entities/Score";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Lightbulb, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TeamCard from "../components/judge/TeamCard";
import ScoringForm from "../components/judge/ScoringForm";

export default function JudgeDashboard() {
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user from storage
    const storedUser = localStorage.getItem('sih_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teamsData, scoresData] = await Promise.all([
        Team.list('team_number'),
        Score.list('-created_date')
      ]);
      setTeams(teamsData);
      setScores(scoresData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleScoreSubmit = async (scoresToSubmit) => {
    try {
      const operations = scoresToSubmit.map(scoreData => {
        const total = scoreData.innovation + scoreData.feasibility + scoreData.presentation + scoreData.technical + scoreData.impact;
        const payload = {
            ...scoreData,
            team_id: selectedTeam.id,
            judge_name: currentUser?.name,
            judge_email: currentUser?.email,
            total: total
        };

        if (scoreData.score_id) {
            // This is an update
            return Score.update(scoreData.score_id, payload);
        } else {
            // This is a new score
            return Score.create(payload);
        }
      });
      
      await Promise.all(operations);
      
      setSelectedTeam(null);
      loadData(); // Refresh scores
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.team_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.members?.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getJudgeScoresForTeam = (teamId) => {
    return scores.filter(score => score.team_id === teamId && score.judge_email === currentUser?.email);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {currentUser?.name}
          </h1>
          <p className="text-slate-600 mt-1">
            Evaluate teams and submit your scores for the hackathon
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Users className="w-4 h-4 mr-1" />
            {teams.length} Teams
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Star className="w-4 h-4 mr-1" />
            {scores.filter(s => s.judge_email === currentUser?.email).length} Ideas Scored
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search teams by name, number, or members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {selectedTeam ? (
        // Scoring Form
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <ScoringForm
            team={selectedTeam}
            existingScores={getJudgeScoresForTeam(selectedTeam.id)}
            onSubmit={handleScoreSubmit}
            onCancel={() => setSelectedTeam(null)}
          />
        </motion.div>
      ) : (
        // Teams List
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <TeamCard
                  team={team}
                  scoredIdeas={getJudgeScoresForTeam(team.id)}
                  onSelect={setSelectedTeam}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTeams.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No teams found</h3>
                <p className="text-slate-400">
                  {searchTerm ? "Try adjusting your search terms" : "No teams have been registered yet"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
