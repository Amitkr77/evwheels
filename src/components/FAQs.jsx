import React from "react";
import { Button } from "./ui/button";
import { MoveUpRightIcon } from "lucide-react";

export default function FAQs() {
  return (
    <section
      className="min-h-[500px] relative"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "ur[](https://startersites.io/blocksy/e-bike/wp-content/uploads/2024/04/home-contact-section-image.webp)",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-end items-center pt-20">
        <div className="bg-brand-yellow-400/90 backdrop-blur-sm p-16 max-w-sm w-full mx-10">
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              Have Questions?
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Donec ultrices tincidunt arcu non sodales. Orci eu lobortis
              elementum nibh tellus molestie nunc. Fames ac turpis egestas
              maecenas pharetra convallis posuere morbi.
            </p>
            <Button className="w-full md:w-auto rounded-none">
              Contact Info <MoveUpRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}