import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

import { Plane, Map, Calendar, Star, ArrowRight, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";

type TestimonialCardProps = {
  text: string;
  author: string;
  role: string;
};
type FeatureCardProps = {
  icon: ReactNode ;
  title: string;
  description: string;
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-16 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Globe2 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">TravelEase</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">About</Button>
            <Button>Sign Up</Button>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Plan Your Dream Trip with Ease
            </h1>
            <p className="text-lg text-gray-600">
              All-in-one travel planner that helps you create perfect itineraries, 
              track expenses, and discover hidden gems worldwide.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700" >
                <Link to="/login">Get Started Free <ArrowRight className="h-4 w-4" /></Link>
                
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="/assets/images/hero/traveller.jpg"
              alt="Travel Planning Dashboard" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need for Perfect Travel Planning
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Map className="h-8 w-8 text-blue-600" />}
            title="Smart Itinerary Planning"
            description="AI-powered suggestions based on your preferences and travel style"
          />
          <FeatureCard 
            icon={<Calendar className="h-8 w-8 text-blue-600" />}
            title="Schedule Management"
            description="Easily organize your daily activities with our intuitive calendar"
          />
          <FeatureCard 
            icon={<Plane className="h-8 w-8 text-blue-600" />}
            title="Flight & Hotel Tracking"
            description="Keep all your bookings in one place with real-time updates"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Loved by Travelers Worldwide
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              text="This app completely transformed how I plan my trips. It's intuitive and powerful!"
              author="Sarah K."
              role="Adventure Traveler"
            />
            <TestimonialCard 
              text="The best travel planning tool I've ever used. Saved me hours of research time."
              author="Michael R."
              role="Business Traveler"
            />
            <TestimonialCard 
              text="Perfect for organizing family vacations. The shared planning feature is amazing!"
              author="Lisa M."
              role="Family Traveler"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Start Planning Your Next Adventure
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of happy travelers who have simplified their travel planning process.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Try TravelEase Free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }:FeatureCardProps) => {
  return (
    <Card className="p-6">
      <CardContent className="space-y-4 pt-4">
        {icon}
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({ text, author, role }: TestimonialCardProps) => {
  return (
    <Card className="p-6">
      <CardContent className="space-y-4 pt-4">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-gray-600">{text}</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Home;