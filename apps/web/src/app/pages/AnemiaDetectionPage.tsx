import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Upload, Camera, Activity, AlertCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { anemiaAPI } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AnemiaDetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => anemiaAPI.detectAnemia(file),
    onSuccess: (res: any) => {
      setResult(res.data);
      toast.success("Analysis complete!");
      queryClient.invalidateQueries({ queryKey: ['patientDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['patientHistory'] });
    },
    onError: () => {
      toast.error("Analysis failed. Please try again.");
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    mutation.mutate(selectedFile);
  };
  const analyzing = mutation.isPending;

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">AI Anemia Detection</h1>
          <p className="text-[#0F172A]/70 mb-8">
            Upload an eye image for instant conjunctiva analysis
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Upload Image</h2>

              {!previewUrl ? (
                <div>
                  <label
                    htmlFor="file-upload"
                    className="block border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-[#0D9488] transition-colors cursor-pointer"
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-[#0F172A] font-semibold mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#0F172A]/70">
                      PNG, JPG up to 10MB
                    </p>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div>
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    <img
                      src={previewUrl}
                      alt="Selected"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="flex-1 bg-[#0D9488] hover:bg-[#0F766E]"
                    >
                      {analyzing ? "Analyzing..." : "Analyze Image"}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="mt-6">
                  <p className="text-sm text-[#0F172A]/70 mb-2">Analyzing image...</p>
                  <Progress value={75} className="h-2" />
                </div>
              )}

              {/* Guidelines */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Image Guidelines
                </h3>
                <ul className="text-sm text-[#0F172A]/70 space-y-1 ml-7">
                  <li>• Clear, well-lit eye image</li>
                  <li>• Focus on lower eyelid conjunctiva</li>
                  <li>• Avoid blurry or low-quality images</li>
                  <li>• Frontal view works best</li>
                </ul>
              </div>
            </Card>

            {/* Results Section */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Analysis Results</h2>

              {!result ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Activity className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-[#0F172A]/70">
                    Upload and analyze an image to see results
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Prediction */}
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#F43F5E]/10 to-[#C0392B]/10 border-2 border-[#F43F5E]/20">
                    <h3 className="text-lg text-[#0F172A]/70 mb-2">Prediction</h3>
                    <p className={`text-4xl font-bold ${result.prediction === "anemic" ? "text-[#F43F5E]" : "text-[#0D9488]"
                      }`}>
                      {result.prediction === "anemic" ? "Anemic" : "Normal"}
                    </p>
                  </div>

                  {/* Confidence */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#0F172A]">Confidence</span>
                      <span className="text-2xl font-bold text-[#0F172A]">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={result.confidence * 100}
                      className="h-3"
                    />
                  </div>

                  {/* Hemoglobin */}
                  <div className="p-4 bg-[#0EA5E9]/10 rounded-lg border border-[#0EA5E9]/20">
                    <p className="text-sm text-[#0F172A]/70 mb-1">Estimated Hemoglobin</p>
                    <p className="text-3xl font-bold text-[#0EA5E9]">
                      {result.hemoglobin_level?.toFixed(1)} <span className="text-lg">g/dL</span>
                    </p>
                    <p className="text-xs text-[#0F172A]/70 mt-1">
                      Normal range: 12-16 g/dL (female), 14-18 g/dL (male)
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-[#0F172A] mb-2">Recommendation</h3>
                    <p className="text-sm text-[#0F172A]/70">{result.recommendation}</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4">
                    <Button
                      className="w-full bg-[#0EA5E9] hover:bg-[#0284C7]"
                      onClick={() => navigate("/patient/doctors")}
                    >
                      Book Consultation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleReset}
                    >
                      New Scan
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
