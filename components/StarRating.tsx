import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, readOnly = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onRatingChange?.(star)}
          disabled={readOnly}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'} transition-transform`}
        >
          <Star 
            size={20} 
            fill={star <= rating ? "#FFFF00" : "none"} 
            stroke={star <= rating ? "#000000" : "#808080"}
            strokeWidth={1.5}
            className={star <= rating ? "drop-shadow-sm" : ""}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;