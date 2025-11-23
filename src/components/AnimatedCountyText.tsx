import { useState, useEffect } from "react";

const kenyaCounties = [
  "Nairobi", "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", 
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", 
  "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", 
  "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans-Nzoia", 
  "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", 
  "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", 
  "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira"
];

export function AnimatedCountyText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % kenyaCounties.length);
        setIsAnimating(false);
      }, 300); // Half of transition duration for smooth effect
      
    }, 2000); // Each county displays for 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`inline-block transition-all duration-500 ease-in-out ${
        isAnimating 
          ? 'opacity-0 transform -translate-y-2' 
          : 'opacity-100 transform translate-y-0'
      }`}
      style={{ minWidth: '200px', textAlign: 'left' }}
    >
      {kenyaCounties[currentIndex]}
    </span>
  );
}