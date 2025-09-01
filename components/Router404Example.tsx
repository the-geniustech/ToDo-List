'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { NotFound } from './NotFound';
import { InteractiveNotFound } from './InteractiveNotFound';
import { Badge } from './ui/badge';
import { Home, Eye, MousePointer, Code, ArrowRight } from 'lucide-react';

type Page = 'home' | 'about' | 'contact' | '404' | 'interactive-404';

/**
 * Example router implementation showing how to integrate 404 pages
 * This demonstrates real-world usage patterns
 */
export const Router404Example: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">404 Page Integration Example</CardTitle>
                <p className="text-muted-foreground text-lg">
                  This demonstrates how to integrate our 3D 404 pages into a real application
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Navigation Examples */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Try Navigation:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => navigate('about')} 
                      variant="outline" 
                      className="justify-start"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Valid Page (About)
                    </Button>
                    <Button 
                      onClick={() => navigate('contact')} 
                      variant="outline" 
                      className="justify-start"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Valid Page (Contact)
                    </Button>
                  </div>
                </div>

                {/* 404 Examples */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">404 Page Variants:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => navigate('404')} 
                      className="justify-start group"
                    >
                      <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Standard 3D 404
                    </Button>
                    <Button 
                      onClick={() => navigate('interactive-404')} 
                      className="justify-start group"
                    >
                      <MousePointer className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Interactive 404
                    </Button>
                  </div>
                </div>

                {/* Implementation Examples */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Implementation Features:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">3D Animations</Badge>
                    <Badge variant="secondary">Dark/Light Theme</Badge>
                    <Badge variant="secondary">Responsive Design</Badge>
                    <Badge variant="secondary">Error Boundaries</Badge>
                    <Badge variant="secondary">Performance Optimized</Badge>
                    <Badge variant="secondary">Accessibility</Badge>
                  </div>
                </div>

                {/* Code Example */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Integration Code:
                  </h3>
                  <div className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <pre className="text-foreground">{`// React Router Example
import { NotFound } from './components/NotFound';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="*" element={
    <NotFound 
      onGoHome={() => navigate('/')}
      onGoBack={() => navigate(-1)}
    />
  } />
</Routes>`}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'about':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">About Page</CardTitle>
                <p className="text-muted-foreground">This is a valid page</p>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => navigate('home')}>
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'contact':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Contact Page</CardTitle>
                <p className="text-muted-foreground">This is a valid page</p>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => navigate('home')}>
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case '404':
        return (
          <NotFound
            title="Page Not Found"
            subtitle="The page you're looking for doesn't exist in this dimension."
            onGoHome={() => navigate('home')}
            onGoBack={() => navigate('home')}
          />
        );

      case 'interactive-404':
        return (
          <InteractiveNotFound
            onGoHome={() => navigate('home')}
            onGoBack={() => navigate('home')}
          />
        );

      default:
        return (
          <NotFound
            onGoHome={() => navigate('home')}
            onGoBack={() => navigate('home')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      {currentPage !== '404' && currentPage !== 'interactive-404' && (
        <nav className="bg-card border-b border-border p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">404 Demo App</h1>
            <div className="flex gap-2">
              <Button 
                variant={currentPage === 'home' ? 'default' : 'ghost'}
                onClick={() => navigate('home')}
                size="sm"
              >
                Home
              </Button>
              <Button 
                variant={currentPage === 'about' ? 'default' : 'ghost'}
                onClick={() => navigate('about')}
                size="sm"
              >
                About
              </Button>
              <Button 
                variant={currentPage === 'contact' ? 'default' : 'ghost'}
                onClick={() => navigate('contact')}
                size="sm"
              >
                Contact
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      {renderPage()}
    </div>
  );
};