"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { trpc } from "@/trpc/react";

export default function ResponseComponent({
  params,
}: {
  params: { id: string };
}) {
  const { data: response, isLoading } = trpc.survey.getResponseById.useQuery({
    id: params.id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Response not found</p>
            <Link href="/dashboard">
              <Button variant="outline" className="mt-4">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Response Header */}
        <Card className="mb-6 border-none shadow-lg">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {response.survey.title}
                </CardTitle>
                {response.survey.description && (
                  <CardDescription className="text-base">
                    {response.survey.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Submitted by</p>
                  <p className="font-medium">{response.user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Submitted on</p>
                  <p className="font-medium">
                    {format(new Date(response.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Total answers</p>
                  <p className="font-medium">{response.answers.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Your Responses</h2>
          {response.answers.map((answer, index) => {
            const question = answer.question;
            const isSelectType = question.type === "select";

            // Find the selected option label if it's a select question
            let displayValue = answer.value;
            if (isSelectType && question.options) {
              const selectedOption = question.options.find(
                (opt) => opt.value === answer.value
              );
              if (selectedOption) {
                displayValue = selectedOption.label;
              }
            }

            return (
              <Card key={answer.id} className="border-none shadow-md">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">
                        {question.title}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </CardTitle>
                      {question.description && (
                        <CardDescription className="text-sm">
                          {question.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="pl-11">
                    <Label className="text-sm text-gray-500 mb-2 block">
                      Your answer:
                    </Label>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {displayValue}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href="/survey">
            <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Take Another Survey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
