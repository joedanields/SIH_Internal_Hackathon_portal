
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lightbulb, CheckCircle, ChevronRight, Clock } from "lucide-react";

export default function TeamCard({ team, scoredIdeas, onSelect }) {
  const totalIdeas = team.project_ideas?.length || 0;
  const scoredCount = scoredIdeas?.length || 0;
  const hasBeenFullyScored = totalIdeas > 0 && scoredCount === totalIdeas;
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      hasBeenFullyScored ? 'border-green-200 bg-green-50/50' : scoredCount > 0 ? 'border-blue-200 bg-blue-50/50' : 'hover:border-blue-300'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                Team {team.team_number}
              </Badge>
              {(scoredCount > 0) && (
                <Badge className={hasBeenFullyScored ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {scoredCount}/{totalIdeas} Scored
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl text-slate-900">{team.team_name}</CardTitle>
          </div>
          <Button
            variant={hasBeenFullyScored ? "outline" : "default"}
            className={hasBeenFullyScored ? "border-green-300 text-green-700 hover:bg-green-50" : ""}
            onClick={() => onSelect(team)}
          >
            {scoredCount > 0 ? "Review/Edit Score" : "Score Team"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Team Members */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Team Members</span>
            <span className="text-sm text-slate-500">({team.members?.length || 0})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {team.members?.map((member, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {member}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Ideas */}
        {team.project_ideas && team.project_ideas.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Project Ideas</span>
              <span className="text-sm text-slate-500">({team.project_ideas.length})</span>
            </div>
            <div className="space-y-2">
              {team.project_ideas.slice(0, 2).map((idea, index) => (
                <div key={index} className="p-2 bg-slate-50 rounded-md">
                  <h4 className="text-sm font-medium text-slate-800">{idea.title}</h4>
                  {idea.description && (
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{idea.description}</p>
                  )}
                </div>
              ))}
              {team.project_ideas.length > 2 && (
                <p className="text-xs text-slate-500 text-center">
                  +{team.project_ideas.length - 2} more ideas
                </p>
              )}
            </div>
          </div>
        )}

        {scoredCount === 0 && (
          <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Pending evaluation</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
