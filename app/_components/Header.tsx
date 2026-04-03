"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { UserButton, useUser } from '@clerk/nextjs';

const courses = [
  {
    id: 1,
    name: 'HTML',
    desc: 'Learn the fundamentals of HTML and build the structure of modern web pages.',
    path: '/course/1/detail',
  },
  {
    id: 2,
    name: 'CSS',
    desc: 'Master CSS to style and design responsive, visually appealing web layouts.',
    path: '/course/2/detail',
  },
  {
    id: 3,
    name: 'React',
    desc: 'Build dynamic and interactive web applications using the React JavaScript library.',
    path: '/course/3/detail',
  },
  {
    id: 4,
    name: 'React Advanced',
    desc: 'Deep dive into advanced React concepts including hooks, state management, performance optimization, and architectural patterns.',
    path: '/course/4/detail',
  },
  {
    id: 5,
    name: 'Python',
    desc: 'Learn Python programming from basics to intermediate level, covering logic building, functions, and real-world applications.',
    path: '/course/5/detail',
  },
  {
    id: 6,
    name: 'Python Advanced',
    desc: 'Master advanced Python concepts such as OOP, modules, APIs, data processing, and automation.',
    path: '/course/6/detail',
  },
  {
    id: 7,
    name: 'Generative AI',
    desc: 'Explore prompt engineering, LLMs, embeddings, image generation, and build GenAI-powered applications.',
    path: '/course/7/detail',
  },
  {
    id: 8,
    name: 'Machine Learning',
    desc: 'Understand ML concepts, algorithms, data preprocessing, model training, evaluation, and deployment.',
    path: '/course/8/detail',
  },
  {
    id: 9,
    name: 'JavaScript',
    desc: 'Learn core JavaScript concepts, asynchronous programming, DOM manipulation, and modern ES6+ features.',
    path: '/course/9/detail',
  },
];

function Header() {
  const { isLoaded, isSignedIn, user } = useUser(); // useUser returns an object [web:2]

  return (
    <div className="p-4 max-w-7xl flex justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <h2 className="font-bold text-3xl font-game">LearnCode</h2>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="gap-8">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid md:grid-cols-2 gap-2 sm:w-[400px] md:w-[500px] lg:w-[600px]">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="p-2 hover:bg-accent rounded-2xl cursor-pointer"
                  >
                    <h2 className="font-medium">{course.name}</h2>
                    <p className="text-sm text-gray-500">{course.desc}</p>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/projects">Projects</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/pricing">Pricing</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/contact-us">Contact Us</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* While Clerk is loading, show nothing or a loader */}
      {!isLoaded ? null : !isSignedIn ? (
        <Link href="/sign-up">
          <Button className="font-game text-2xl" variant="pixel">
            Sign up
          </Button>
        </Link>
      ) : (
        <>
          <div className="flex items-center gap-4 ">
            <Link href="/dashboard">
              <Button className="font-game text-2xl" variant="pixel">
                Dashboard
              </Button>
            </Link>

            <UserButton />
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
