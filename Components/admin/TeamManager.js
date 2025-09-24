import React, { useState } from "react";
import { Team } from "@/entities/Team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Lightbulb, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamManager({ teams, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    team_number: "",
    team_name: "",
    members: [""],
    project_ideas: [{ title: "", description: "" }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Team.create({
        ...formData,
        members: formData.members.filter(m => m.trim()),
        project_ideas: formData.project_ideas.filter(p => p.title.trim())
      });
      setShowForm(false);
      setFormData({
        team_number: "",
        team_name: "",
        members: [""],
        project_ideas: [{ title: "", description: "" }]
      });
      onUpdate();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, ""]
    }));
  };

  const removeMember = (index) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const addProjectIdea = () => {
    setFormData(prev => ({
      ...prev,
      project_ideas: [...prev.project_ideas, { title: "", description: "" }]
    }));
  };

  const removeProjectIdea = (index) => {
    setFormData(prev => ({
      ...prev,
      project_ideas: prev.project_ideas.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Add Team Button */}
      <Button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Team
      </Button>

      {/* Add Team Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Add New Team</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Number</label>
                      <Input
                        required
                        value={formData.team_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, team_number: e.target.value }))}
                        placeholder="e.g., T001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Name</label>
                      <Input
                        required
                        value={formData.team_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, team_name: e.target.value }))}
                        placeholder="Enter team name"
                      />
                    </div>
                  </div>

                  {/* Members */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Team Members</label>
                    <div className="space-y-2">
                      {formData.members.map((member, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={member}
                            onChange={(e) => {
                              const newMembers = [...formData.members];
                              newMembers[index] = e.target.value;
                              setFormData(prev => ({ ...prev, members: newMembers }));
                            }}
                            placeholder={`Member ${index + 1} name`}
                          />
                          {formData.members.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeMember(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {formData.members.length < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addMember}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Member
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Project Ideas */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Ideas</label>
                    <div className="space-y-3">
                      {formData.project_ideas.map((idea, index) => (
                        <div key={index} className="p-3 border rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Idea {index + 1}</span>
                            {formData.project_ideas.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProjectIdea(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <Input
                            value={idea.title}
                            onChange={(e) => {
                              const newIdeas = [...formData.project_ideas];
                              newIdeas[index].title = e.target.value;
                              setFormData(prev => ({ ...prev, project_ideas: newIdeas }));
                            }}
                            placeholder="Project title"
                          />
                          <Textarea
                            value={idea.description}
                            onChange={(e) => {
                              const newIdeas = [...formData.project_ideas];
                              newIdeas[index].description = e.target.value;
                              setFormData(prev => ({ ...prev, project_ideas: newIdeas }));
                            }}
                            placeholder="Project description"
                            rows={2}
                          />
                        </div>
                      ))}
                      {formData.project_ideas.length < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addProjectIdea}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Project Idea
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Create Team
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teams List */}
      <div className="grid gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      Team {team.team_number}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50">
                      {team.status || 'registered'}
                    </Badge>
                  </div>
                  <CardTitle>{team.team_name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Members */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium">Team Members ({team.members?.length || 0})</span>
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
                      <span className="text-sm font-medium">Project Ideas ({team.project_ideas.length})</span>
                    </div>
                    <div className="space-y-2">
                      {team.project_ideas.map((idea, index) => (
                        <div key={index} className="p-2 bg-slate-50 rounded-md">
                          <h5 className="text-sm font-medium">{idea.title}</h5>
                          {idea.description && (
                            <p className="text-xs text-slate-600 mt-1">{idea.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}