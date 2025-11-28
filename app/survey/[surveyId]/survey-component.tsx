"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/trpc/react";

export default function SurveyComponent({
  params,
}: {
  params: { surveyId: string };
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: survey, isLoading } = trpc.survey.getById.useQuery({
    id: params.surveyId,
  });

  const submitMutation = trpc.survey.submit.useMutation({
    onSuccess: () => {
      toast.success("Survey submitted successfully!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit survey");
      setIsSubmitting(false);
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Survey not found</p>
            <Link href="/survey">
              <Button variant="outline" className="mt-4">
                Back to Surveys
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions = survey.questions || [];
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastQuestion = currentStep === questions.length - 1;

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    return !!answers[currentQuestion.id];
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error("Please answer this required question");
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate required questions
    const unansweredRequired = questions.filter(
      (q) => q.required && !answers[q.id]
    );

    if (unansweredRequired.length > 0) {
      toast.error("Please answer all required questions");
      setIsSubmitting(false);
      return;
    }

    // Convert answers to array format
    const answersArray = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    submitMutation.mutate({
      surveyId: params.surveyId,
      answers: answersArray,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Link href="/survey">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Surveys
          </Button>
        </Link>

        {/* Survey Header */}
        <Card className="mb-6 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{survey.title}</CardTitle>
            {survey.description && (
              <CardDescription className="text-base mt-2">
                {survey.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Question {currentStep + 1} of {questions.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="mb-6 border-none shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold">
                    {currentStep + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {currentQuestion.title}
                    {currentQuestion.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </CardTitle>
                  {currentQuestion.description && (
                    <CardDescription className="mt-2">
                      {currentQuestion.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="pl-13">
                {/* Select Type */}
                {currentQuestion.type === "select" &&
                  currentQuestion.options && (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={handleAnswerChange}
                    >
                      <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.id}
                            />
                            <Label
                              htmlFor={option.id}
                              className="flex-1 cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                {/* Textarea Type */}
                {currentQuestion.type === "textarea" && (
                  <Textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="resize-none"
                  />
                )}

                {/* Text Type */}
                {currentQuestion.type === "text" && (
                  <Input
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Type your answer here..."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={isSubmitting || !canProceed()}
            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : isLastQuestion ? (
              <>
                Submit Survey
                <CheckCircle2 className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {Object.keys(answers).length} of {questions.length} questions answered
        </div>
      </div>
    </div>
  );
}
