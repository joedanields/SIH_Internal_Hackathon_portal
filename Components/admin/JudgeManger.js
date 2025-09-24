import React, { useState } from "react";
import { Judge } from "@/entities/Judge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UserCheck, Shield, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JudgeManager({ judges, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    login_code: "",
    role: "judge"
  });

  const generateLoginCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, login_code: code }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Judge.create(formData);
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        login_code: "",
        role: "judge"
      });
      onUpdate();
    } catch (error) {
      console.error("Error creating judge:", error);
    }
  };

  const getRoleColor = (role) => {
    return role === 'admin' 
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <div className="space-y-6">
      {/* Add Judge Button */}
      <Button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Judge
      </Button>

      {/* Add Judge Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Add New Judge</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Judge's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="judge@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Login Code</label>
                      <div className="flex gap-2">
                        <Input
                          required
                          value={formData.login_code}
                          onChange={(e) => setFormData(prev => ({ ...prev, login_code: e.target.value.toUpperCase() }))}
                          placeholder="Enter or generate code"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateLoginCode}
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="judge">Judge</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Create Judge
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

      {/* Judges List */}
      <div className="grid gap-4">
        {judges.map((judge) => (
          <Card key={judge.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    judge.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {judge.role === 'admin' ? (
                      <Shield className={`w-5 h-5 ${
                        judge.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                      }`} />
                    ) : (
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{judge.name}</h3>
                    <p className="text-sm text-slate-600">{judge.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={getRoleColor(judge.role)}>
                      {judge.role === 'admin' ? 'Admin' : 'Judge'}
                    </Badge>
                    <p className="text-sm text-slate-500 mt-1">
                      Code: <code className="bg-slate-100 px-1 rounded">{judge.login_code}</code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {judges.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No judges added yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}