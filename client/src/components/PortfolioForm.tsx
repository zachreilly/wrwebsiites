import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Upload, Loader2, Image } from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";

interface PortfolioFormProps {
  sessionPassword: string;
  onClose: () => void;
}

interface PortfolioFormData {
  projectTitle: string;
  clientName: string;
  projectType: string;
  imageUrl: string;
  technologiesUsed: string;
  projectUrl: string;
  completionDate: string;
  isFeatured: boolean;
  isPublic: boolean;
}

export function PortfolioForm({ sessionPassword, onClose }: PortfolioFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<PortfolioFormData>({
    projectTitle: '',
    clientName: '',
    projectType: '',
    imageUrl: '',
    technologiesUsed: '',
    projectUrl: '',
    completionDate: '',
    isFeatured: false,
    isPublic: true
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      const response = await apiRequest("POST", `/api/admin/portfolio?password=${sessionPassword}`, data);
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

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleImageUploadComplete = (uploadedImageUrl: string) => {
    // Normalize the uploaded URL to use our object serving endpoint
    const normalizedUrl = uploadedImageUrl.replace('https://storage.googleapis.com/', '/objects/');
    setFormData(prev => ({ ...prev, imageUrl: normalizedUrl }));
    toast({
      title: "Image uploaded",
      description: "Your project image has been uploaded successfully",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.projectTitle || !formData.clientName || !formData.projectType || !formData.imageUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including uploading an image",
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
                <Label>Project Image *</Label>
                <div className="space-y-3">
                  <ObjectUploader
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleImageUploadComplete}
                    buttonClassName="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Project Image
                  </ObjectUploader>
                  
                  {formData.imageUrl && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Image className="w-4 h-4" />
                        <span className="text-sm font-medium">Image uploaded successfully!</span>
                      </div>
                      <p className="text-xs text-emerald-600 mt-1 break-all">
                        {formData.imageUrl}
                      </p>
                    </div>
                  )}
                </div>
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