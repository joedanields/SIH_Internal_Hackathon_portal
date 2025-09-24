
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Lightbulb, Save, Star } from "lucide-react";
import { motion } from "framer-motion";
import ScoreSlider from "../common/ScoreSlider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SCORING_CATEGORIES = [
  {
    key: "innovation",
    label: "Innovation",
    description: "Creativity and originality of the solution",
    icon: "💡"
  },
  {
    key: "feasibility",
    label: "Feasibility",
    description: "Practicality and implementability",
    icon: "⚡"
  },
  {
    key: "presentation",
    label: "Presentation",
    description: "Communication skills and clarity",
    icon: "🎯"
  },
  {
    key: "technical",
    label: "Technical Implementation",
    description: "Technical depth and execution quality",
    icon: "🛠️"
  },
  {
    key: "impact",
    label: "Impact/Scalability",
    description: "Potential impact and scalability",
    icon: "📈"
  }
];

export default function ScoringForm({ team, existingScores = [], onSubmit, onCancel }) {
  const initialScores = team.project_ideas.reduce((acc, idea) => {
    const existing = existingScores.find(s => s.project_idea_title === idea.title);
    acc[idea.title] = {
      innovation: existing?.innovation || 0,
      feasibility: existing?.feasibility || 0,
      presentation: existing?.presentation || 0,
      technical: existing?.technical || 0,
      impact: existing?.impact || 0,
      comments: existing?.comments || "",
      score_id: existing?.id, // Keep track of existing score ID for updates
    };
    return acc;
  }, {});

  const [scoresData, setScoresData] = useState(initialScores);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (ideaTitle, category, value) => {
    setScoresData(prev => ({
      ...prev,
      [ideaTitle]: { ...prev[ideaTitle], [category]: value }
    }));
  };

  const calculateTotalForIdea = (ideaTitle) => {
    const ideaScores = scoresData[ideaTitle] || {};
    return SCORING_CATEGORIES.reduce((sum, cat) => sum + (ideaScores[cat.key] || 0), 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const scoresToSubmit = Object.entries(scoresData).map(([title, data]) => ({
        team_id: team.id, // Ensure team_id is included for each score object
        project_idea_title: title,
        innovation: data.innovation,
        feasibility: data.feasibility,
        presentation: data.presentation,
        technical: data.technical,
        impact: data.impact,
        comments: data.comments,
        score_id: data.score_id,
      }));
      await onSubmit(scoresToSubmit);
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
    setIsSubmitting(false);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  const getTotalColor = (total) => {
    // This is used for background color classes, so split them out.
    // We expect the first part to be the text color.
    if (total >= 40) return "text-green-600 bg-green-50 border-green-200";
    if (total >= 30) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (total >= 20) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const scoredIdeasCount = existingScores.length;
  const totalIdeasCount = team.project_ideas.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onCancel}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-slate-100 text-slate-800">
                  Team {team.team_number}
                </Badge>
                {scoredIdeasCount > 0 && (
                  <Badge className={scoredIdeasCount === totalIdeasCount ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {scoredIdeasCount}/{totalIdeasCount} Ideas Scored
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{team.team_name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Team Members */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700">Team Members</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {team.members?.map((member, index) => (
                <Badge key={index} variant="outline">
                  {member}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Evaluate Project Ideas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={team.project_ideas.map(p => p.title)} className="w-full">
            {team.project_ideas.map((idea, index) => {
              const totalScore = calculateTotalForIdea(idea.title);
              const totalColorClass = getTotalColor(totalScore).split(' ')[0]; // Extract text color
              const isIdeaScored = existingScores.some(es => es.project_idea_title === idea.title);

              return (
                <AccordionItem value={idea.title} key={index}>
                  <AccordionTrigger className={`hover:no-underline rounded-lg px-4 ${
                      isIdeaScored ? 'bg-blue-50/50' : ''
                    }`}>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-slate-900">{idea.title}</h3>
                      {idea.description && (
                         <p className="text-sm text-slate-500 font-normal line-clamp-1">{idea.description}</p>
                      )}
                    </div>
                    <div className={`text-lg font-bold ml-4 ${totalColorClass}`}>
                      {totalScore}/50
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 px-4 border-t">
                    <div className="space-y-6">
                      {SCORING_CATEGORIES.map((category) => (
                        <div key={category.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                <span className="text-lg">{category.icon}</span>
                                {category.label}
                              </h4>
                              <p className="text-sm text-slate-600">{category.description}</p>
                            </div>
                            <div className={`text-xl font-bold ${getScoreColor(scoresData[idea.title]?.[category.key] || 0)}`}>
                              {scoresData[idea.title]?.[category.key] || 0}/10
                            </div>
                          </div>
                          <ScoreSlider
                            value={scoresData[idea.title]?.[category.key] || 0}
                            onChange={(value) => handleScoreChange(idea.title, category.key, value)}
                            max={10}
                          />
                        </div>
                      ))}
                      <div className="space-y-2 pt-4 border-t">
                        <label className="text-sm font-medium text-slate-700">
                          Comments for "{idea.title}"
                        </label>
                        <Textarea
                          placeholder="Share your feedback for this specific idea..."
                          value={scoresData[idea.title]?.comments || ""}
                          onChange={(e) => handleScoreChange(idea.title, "comments", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save All Scores"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
