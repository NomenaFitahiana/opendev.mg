"use client";

import React from "react";

const FallbackIcon = ({ name, className }: { name: string; className?: string }) => (
  <div className={`bg-muted rounded flex items-center justify-center ${className || "w-5 h-5"}`}>
    <span className="text-[8px]">{name.slice(0, 2).toUpperCase()}</span>
  </div>
);

interface TechIconProps {
  name: string;
  logo?: string | null;
  className?: string;
}

export function TechIcon({ name, logo, className = "w-5 h-5" }: TechIconProps) {
  if (logo) {
    return <img src={logo} alt={name} className={className} />;
  }

  return <FallbackIcon name={name} className={className} />;
}