import type { HTMLAttributes } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;