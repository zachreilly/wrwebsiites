import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Plus, Loader2 } from "lucide-react";

interface PortfolioFormProps {
  sessionPassword: string;
  onClose: () => void;
}

interface PortfolioFormData {
  projectTitle: string;
  clientName: string;
  projectType: string;
  description: string;
  technologiesUsed: string;
  projectUrl: string;
  completionDate: string;
  isFeatured: boolean;
  isPublic: boolean;
  imageUrls: string[];
}

export function PortfolioForm({ sessionPassword, onClose }: PortfolioFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<PortfolioFormData>({
    projectTitle: '',
    clientName: '',
    projectType: '',
    description: '',
    technologiesUsed: '',
    projectUrl: '',
    completionDate: '',
    isFeatured: false,
    isPublic: true,
    imageUrls: ['']
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      const response = await apiRequest("POST", `/api/admin/portfolio?password=${sessionPassword}`, {
        ...data,
        imageUrls: data.imageUrls.filter(url => url.trim() !== '')
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/portfolio'] });
      toast({
        title: "Portfolio item created",
        description: "Your project has been added to the portfolio successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create portfolio item",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof PortfolioFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageUrl = () => {
    setFormData(prev => ({ 
      ...prev, 
      imageUrls: [...prev.imageUrls, ''] 
    }));
  };

  const removeImageUrl = (index: number) => {
    if (formData.imageUrls.length > 1) {
      const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.projectTitle || !formData.clientName || !formData.projectType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createPortfolioMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add Portfolio Item</CardTitle>
              <CardDescription>
                Showcase a completed project in your portfolio
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-portfolio-form"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Project Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Input
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                    placeholder="e.g., Modern Business Website"
                    required
                    data-testid="input-project-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="e.g., ABC Company Ltd"
                    required
                    data-testid="input-client-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                    <SelectTrigger data-testid="select-project-type">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Website</SelectItem>
                      <SelectItem value="premium">Premium Business Website</SelectItem>
                      <SelectItem value="custom">Custom Project</SelectItem>
                      <SelectItem value="update">Website Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => handleInputChange('completionDate', e.target.value)}
                    data-testid="input-completion-date"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the project, what was built, key features, challenges solved..."
                  rows={4}
                  required
                  data-testid="textarea-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="technologiesUsed">Technologies Used</Label>
                  <Input
                    id="technologiesUsed"
                    value={formData.technologiesUsed}
                    onChange={(e) => handleInputChange('technologiesUsed', e.target.value)}
                    placeholder="e.g., React, Node.js, Tailwind CSS"
                    data-testid="input-technologies"
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectUrl">Live Project URL</Label>
                  <Input
                    id="projectUrl"
                    type="url"
                    value={formData.projectUrl}
                    onChange={(e) => handleInputChange('projectUrl', e.target.value)}
                    placeholder="https://example.com"
                    data-testid="input-project-url"
                  />
                </div>
              </div>
            </div>

            {/* Project Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Project Images
              </h3>
              
              <div className="space-y-3">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`imageUrl-${index}`}>
                        Image URL {index + 1} {index === 0 && "*"}
                      </Label>
                      <Input
                        id={`imageUrl-${index}`}
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        required={index === 0}
                        data-testid={`input-image-url-${index}`}
                      />
                    </div>
                    {formData.imageUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImageUrl(index)}
                        className="mt-6"
                        data-testid={`button-remove-image-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {formData.imageUrls.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImageUrl}
                    className="w-full"
                    data-testid="button-add-image"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Image
                  </Button>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Portfolio Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublic">Public Visibility</Label>
                    <p className="text-sm text-slate-500">
                      Make this project visible to website visitors
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                    data-testid="switch-is-public"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isFeatured">Featured Project</Label>
                    <p className="text-sm text-slate-500">
                      Highlight this as one of your best projects
                    </p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                    data-testid="switch-is-featured"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPortfolioMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-submit-portfolio"
              >
                {createPortfolioMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Portfolio Item'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}