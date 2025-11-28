import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, BarChart3, Users, Zap } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Powerful Surveys
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Collect valuable insights with beautiful, easy-to-build surveys.
                Get started in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-linear-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/survey">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Browse Surveys
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Lightning Fast</CardTitle>
                  <CardDescription>
                    Create surveys in minutes with our intuitive builder
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Real-time Analytics</CardTitle>
                  <CardDescription>
                    Track responses and visualize data instantly
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-lg">Team Collaboration</CardTitle>
                  <CardDescription>
                    Work together seamlessly with your team
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Easy to Use</CardTitle>
                  <CardDescription>
                    No technical skills required to get started
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-linear-to-br from-blue-600 to-purple-600">
          <div className="container mx-auto max-w-4xl text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of teams already using SurveyPro
            </p>
            <Link href="sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Your First Survey
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
