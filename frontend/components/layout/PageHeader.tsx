"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function PageHeader({
  eyebrow,
  title,
  subtext,
}: {
  eyebrow: string;
  title: string;
  subtext: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-navy">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto max-w-[1200px] px-6 py-16 lg:px-16"
      >
        <p className="font-body text-label uppercase tracking-[0.04em] text-gold-light">
          {eyebrow}
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-display-lg text-paper">{title}</h1>
        <p className="mt-3 max-w-2xl font-body text-body-lg text-paper/80">{subtext}</p>
      </motion.div>
    </section>
  );
}
