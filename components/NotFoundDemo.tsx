'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { NotFound } from './NotFound';
import { InteractiveNotFound } from './InteractiveNotFound';
import { NotFoundStandalone } from './NotFoundStandalone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Eye, MousePointer, Layers, Home } from 'lucide-react';

type DemoVariant = 'standard' | 'interactive' | 'standalone' | null;

/**
 * Demo component to showcase different 404 page variants
 * This would typically be used in a development/showcase environment
 */
export const NotFoundDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoVariant>(null);

  const demos = [
    {
      id: 'standard' as const,
      title: 'Standard 3D 404',
      description: 'Full-featured 404 page with animated 3D scene, floating shapes, and particle systems',
      icon: <Eye className="w-5 h-5" />,
      features: ['3D Animations', 'Particle Systems', 'Theme Support', 'Responsive Design'],
      component: NotFound,
    },
    {
      id: 'interactive' as const,
      title: 'Interactive 404',
      description: 'Enhanced version with mouse interaction, clickable objects, and dynamic background',
      icon: <MousePointer className="w-5 h-5" />,
      features: ['Mouse Interaction', 'Clickable Objects', 'Dynamic Colors', 'Real-time Feedback'],
      component: InteractiveNotFound,
    },
    {
      id: 'standalone' as const,
      title: 'Standalone 404',
      description: 'Self-contained version that can be used independently without app context',
      icon: <Layers className="w-5 h-5" />,
      features: ['Independent', 'Error Boundaries', 'Fallback Support', 'Theme Provider'],
      component: NotFoundStandalone,
    },
  ];

  const renderDemo = () => {
    if (!activeDemo) return null;

    const demo = demos.find(d => d.id === activeDemo);
    if (!demo) return null;

    const Component = demo.component;

    return (
      <div className="fixed inset-0 z-50">
        <Component
          title={`${demo.title} Demo`}
          subtitle="This is a demonstration of the 404 page component"
          onGoHome={() => setActiveDemo(null)}
          onGoBack={() => setActiveDemo(null)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            404 Page Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore different variants of our 3D Not Found page with React Three Fiber.
            Each variant offers unique features and interaction patterns.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <Card key={demo.id} className="relative group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {demo.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{demo.title}</CardTitle>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {demo.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {demo.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => setActiveDemo(demo.id)}
                  className="w-full group transition-all duration-300 hover:shadow-md"
                >
                  <span className="flex items-center gap-2">
                    {demo.icon}
                    View Demo
                  </span>
                </Button>
              </CardContent>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Usage Examples */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Usage Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Example 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Usage</CardTitle>
                <CardDescription>
                  Simple implementation for most use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`import { NotFound } from './components/NotFound';

// Basic usage
<NotFound />

// With custom callbacks
<NotFound 
  onGoHome={() => navigate('/')}
  onGoBack={() => navigate(-1)}
/>`}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Code Example 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">With Provider</CardTitle>
                <CardDescription>
                  Using the NotFoundProvider for programmatic control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`import { useNotFound } from './components/NotFoundProvider';

function MyComponent() {
  const { showNotFound } = useNotFound();
  
  const handle404 = () => {
    showNotFound({
      title: "Custom Title",
      subtitle: "Custom message"
    });
  };
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Technical Implementation</CardTitle>
            <CardDescription>
              Built with cutting-edge web technologies for maximum performance and visual appeal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'React Three Fiber', description: '3D rendering engine' },
                { label: 'Drei Components', description: 'Pre-built 3D helpers' },
                { label: 'Motion/React', description: 'Smooth animations' },
                { label: 'Tailwind CSS v4', description: 'Modern styling' },
              ].map((tech) => (
                <div key={tech.label} className="text-center p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground">{tech.label}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{tech.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Back to App Button */}
        <div className="text-center pt-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="group"
          >
            <Home className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            Back to Main App
          </Button>
        </div>
      </div>

      {/* Render Active Demo */}
      {renderDemo()}
    </div>
  );
};