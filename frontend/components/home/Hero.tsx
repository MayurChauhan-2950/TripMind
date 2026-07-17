"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-navy">
      <Image
        src="/images/hero-taj-mahal.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-navy/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy to-navy/60" />
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mx-auto max-w-[1200px] px-6 py-24 lg:px-16"
      >
        <p className="font-body text-label uppercase tracking-[0.04em] text-gold-light">
          TripMind
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-display-lg text-paper sm:text-display-xl">
          Discover destinations. Plan with AI. Know the cost before you go.
        </h1>
        <p className="mt-4 max-w-xl font-body text-body-lg text-paper/80">
          A recommendation engine that scores destinations against how you actually travel, an
          AI itinerary generator, and a custom budget calculator — all in one place.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/explore">
            <Button variant="primary-on-dark">Start exploring</Button>
          </Link>
          <Link href="/planner">
            <Button variant="secondary-on-dark">Plan with AI</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
