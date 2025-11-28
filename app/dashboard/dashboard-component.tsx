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
import { Plus, FileText, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/react";

export default function DashboardComponent() {
  const { data: responses, isLoading } = trpc.survey.getMyResponses.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-gray-600">
            Track your survey responses and start new surveys
          </p>
        </div>

        {/* Start New Survey Card */}
        <Card className="mb-8 border-2 border-dashed border-blue-300 bg-linear-to-br from-blue-50 to-purple-50 hover:border-blue-400 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Start a New Survey
            </CardTitle>
            <CardDescription>
              Browse available surveys and share your feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/survey">
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Browse Surveys
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Submitted Surveys */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            My Submitted Surveys
          </h2>

          {!responses || responses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  You haven&apos;t submitted any surveys yet
                </p>
                <Link href="/survey">
                  <Button variant="outline">Browse Surveys</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {responses.map((response) => (
                <Link
                  key={response.id}
                  href={`/dashboard/responses/${response.id}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all border-none shadow-md hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="line-clamp-2 text-lg">
                        {response.survey.title}
                      </CardTitle>
                      {response.survey.description && (
                        <CardDescription className="line-clamp-2">
                          {response.survey.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Submitted{" "}
                        {formatDistanceToNow(new Date(response.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">
                          {response.answers.length}{" "}
                          {response.answers.length === 1 ? "answer" : "answers"}{" "}
                          provided
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
