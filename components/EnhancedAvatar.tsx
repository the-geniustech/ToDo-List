'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface EnhancedAvatarProps {
  id: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

export const EnhancedAvatar: React.FC<EnhancedAvatarProps> = ({
  id,
  name,
  size = 'md',
  className = '',
  showOnlineStatus = false,
  isOnline = false
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate consistent avatar URL based on user ID
  const getAvatarUrl = (userId: string) => {
    // Use a seed based on user ID for consistent images
    const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://images.unsplash.com/photo-${1500000000000 + (seed % 100000000)}?w=150&h=150&fit=crop&crop=face&auto=format`;
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Size classes
  const sizeClasses = {
    xs: 'w-4 h-4 text-xs',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg'
  };

  const statusSizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <Avatar className={`${sizeClasses[size]} border-2 border-card shadow-sm theme-transition`}>
        {!imageError && (
          <AvatarImage
            src={getAvatarUrl(id)}
            alt={name}
            onError={() => setImageError(true)}
            className="object-cover"
          />
        )}
        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-medium">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {showOnlineStatus && (
        <div 
          className={`absolute -bottom-0 -right-0 ${statusSizeClasses[size]} rounded-full border-2 border-card theme-transition ${
            isOnline ? 'bg-green-500' : 'bg-muted-foreground'
          }`}
        />
      )}
    </div>
  );
};