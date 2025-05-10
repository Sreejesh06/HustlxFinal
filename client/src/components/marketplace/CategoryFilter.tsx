import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  // Check if scroll buttons should be visible
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Initial check
    checkScroll();

    // Add scroll event listener
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, [categories]);

  // Scroll left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-6">
      {/* Left scroll button */}
      {showLeftScroll && (
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1.5 border border-gray-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}
      
      {/* Categories */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-3 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`whitespace-nowrap px-4 py-2 rounded-full flex-shrink-0 ${
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Right scroll button */}
      {showRightScroll && (
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1.5 border border-gray-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
