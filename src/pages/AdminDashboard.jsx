
import React, { useState, useEffect } from "react";
import { Team } from "@/entities/Team";
import { Score } from "@/entities/Score";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Trophy, Users, BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Leaderboard from "../components/admin/Leaderboard";
import StatsCards from "../components/admin/StatsCards";

export default function AdminDashboard() {
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
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

  const calculateLeaderboard = () => {
    // Group scores by team
    const scoresByTeam = scores.reduce((acc, score) => {
      acc[score.team_id] = acc[score.team_id] || [];
      acc[score.team_id].push(score);
      return acc;
    }, {});

    const teamStats = teams.map(team => {
      const teamScores = scoresByTeam[team.id] || [];
      
      // Group scores for this team by project idea
      // Each project idea title will hold an array of total scores given for that idea.
      const scoresByIdea = teamScores.reduce((acc, score) => {
          // Ensure score.project_idea_title exists before using it as a key
          if (score.project_idea_title) {
            acc[score.project_idea_title] = acc[score.project_idea_title] || [];
            acc[score.project_idea_title].push(score.total || 0); // Use 0 if total is undefined
          }
          return acc;
      }, {});
      
      let finalScore = 0;
      let ideasScoredCount = 0;
      
      // Calculate average for each idea and sum them up
      for (const ideaTitle in scoresByIdea) {
          const ideaScores = scoresByIdea[ideaTitle];
          if (ideaScores.length > 0) {
              const ideaAverage = ideaScores.reduce((sum, s) => sum + s, 0) / ideaScores.length;
              finalScore += ideaAverage;
              ideasScoredCount++;
          }
      }
      
      const uniqueJudges = new Set(teamScores.map(s => s.judge_email));

      return {
        ...team,
        judgeCount: uniqueJudges.size, // Number of unique judges that scored this team
        ideasScoredCount, // Number of unique project ideas that received at least one score
        finalScore, // Sum of average scores per project idea
      };
    });

    return teamStats.sort((a, b) => b.finalScore - a.finalScore);
  };

  const exportResults = async () => {
    setIsExporting(true);
    try {
      const leaderboard = calculateLeaderboard();
      
      // Prepare data for export
      const exportData = [];
      
      leaderboard.forEach((team, index) => {
        const teamScores = scores.filter(score => score.team_id === team.id);
        
        if (teamScores.length > 0) {
          teamScores.forEach(score => {
            exportData.push({
              Rank: index + 1,
              'Team No': team.team_number,
              'Team Name': team.team_name,
              'Members': team.members?.join(', ') || '',
              'Project Idea Titles': team.project_ideas?.map(p => p.title).join('; ') || '',
              'Scored Idea Title': score.project_idea_title || '', // Added for specific idea scored
              'Judge Name': score.judge_name,
              'Judge Email': score.judge_email,
              Innovation: score.innovation,
              Feasibility: score.feasibility,
              Presentation: score.presentation,
              'Technical Implementation': score.technical,
              'Impact/Scalability': score.impact,
              'Total Score (Judge)': score.total, // Renamed for clarity
              'Team Final Score (Aggregate)': team.finalScore.toFixed(2), // New aggregate score
              Comments: score.comments || ''
            });
          });
        } else {
          // Team with no scores
          exportData.push({
            Rank: 'Not Scored',
            'Team No': team.team_number,
            'Team Name': team.team_name,
            'Members': team.members?.join(', ') || '',
            'Project Idea Titles': team.project_ideas?.map(p => p.title).join('; ') || '',
            'Scored Idea Title': '',
            'Judge Name': '',
            'Judge Email': '',
            Innovation: '',
            Feasibility: '',
            Presentation: '',
            'Technical Implementation': '',
            'Impact/Scalability': '',
            'Total Score (Judge)': '',
            'Team Final Score (Aggregate)': '',
            Comments: ''
          });
        }
      });

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle values that might contain commas or newlines by wrapping them in double quotes
            if (typeof value === 'string') {
              const escapedValue = value.replace(/"/g, '""'); // Escape double quotes
              return value.includes(',') || value.includes('\n') ? `"${escapedValue}"` : value;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `SIH_Hackathon_Results_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error exporting results:", error);
    }
    setIsExporting(false);
  };

  const leaderboard = calculateLeaderboard();
  const totalScoresSubmitted = scores.length;
  // Calculate average of all individual judge scores (not the team's final score)
  const averageTotalScore = scores.length > 0 ? scores.reduce((sum, s) => sum + (s.total || 0), 0) / scores.length : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Monitor hackathon progress and export results
          </p>
        </div>
        <Button
          onClick={exportResults}
          disabled={isExporting || teams.length === 0}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Export Results"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCards
          title="Total Teams"
          value={teams.length}
          icon={Users}
          color="blue"
        />
        <StatsCards
          title="Total Scores Submitted"
          value={totalScoresSubmitted}
          icon={BarChart3}
          color="green"
        />
        <StatsCards
          title="Avg. Idea Score"
          value={`${averageTotalScore.toFixed(1)}/50`}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCards
          title="Top Idea Score"
          value={scores.length > 0 ? `${Math.max(...scores.map(s => s.total || 0))}/50` : "0/50"}
          icon={Trophy}
          color="amber"
        />
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Leaderboard teams={leaderboard} />
      </motion.div>
    </div>
  );
}
