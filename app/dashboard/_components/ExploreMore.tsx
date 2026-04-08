import React from "react";
import Image from "next/image";

const exploreOptions = [
  {
    title: "Quizz Pack",
    description: "Practice what you learned with bite-sized code challenges.",
    icon: "/tree.png",
  },
  {
    title: "Video Courses",
    description: "Learn with structured video lessons taught step-by-step.",
    icon: "/game.png",
  },
  {
    title: "Community Project",
    description: "Build real-world apps by collaborating with the community.",
    icon: "/growth.png",
  },
  {
    title: "Explore Apps",
    description: "Explore prebuild app which you can try demo and build it.",
    icon: "/start-up.png",
  },
];

function ExploreMore() {
  return (
    <div className="mt-8">
      <h2 className="font-game text-2xl mb-6 text-white/90 tracking-tight">Explore More</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {exploreOptions.map((option) => (
          <div
            key={option.title}
            className="flex items-start gap-4 bg-zinc-900/40 p-6 rounded-[1.5rem] border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all cursor-pointer group"
          >
            <div className="shrink-0 p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 group-hover:scale-110 transition-transform duration-300">
              <Image
                src={option.icon}
                alt={option.title}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col justify-center h-full pt-1">
              <h3 className="font-game text-base text-zinc-100 group-hover:text-white transition-colors">{option.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed mt-1 line-clamp-2">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreMore;
