"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import type { PageInfo } from "@/types";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation";
import { containerVariants, itemVariants } from "@/lib/animations";

type Props = {
  pageInfo: PageInfo;
};

export default function ContactMe({ pageInfo }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormInput> = async (data) => {
    try {
      setError(null);
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const contactInfo = pageInfo?.contactInfo || {
    phoneNumber: "",
    email: "",
    address: "",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden"
    >
      <h3 className="section-title">Contact</h3>

      <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-5 sm:px-8 pt-36 pb-12 md:pt-40 w-full">
        <motion.h4
          variants={itemVariants}
          className="text-xl sm:text-2xl font-semibold text-center text-black"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          I got just what you need.{" "}
          <span className="underline decoration-black text-black">
            Let&apos;s Talk.
          </span>
        </motion.h4>

        <motion.div variants={itemVariants} className="pt-4 pb-6 space-y-3">
          {[
            {
              icon: PhoneIcon,
              label: contactInfo.phoneNumber || "Phone",
            },
            {
              icon: EnvelopeIcon,
              label: contactInfo.email || "Email",
            },
            {
              icon: MapPinIcon,
              label: contactInfo.address || "Address",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center space-x-5 justify-center"
            >
              <item.icon className="text-black h-6 w-6 animate-pulse" />
              <p className="text-lg sm:text-xl text-neutral-700">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3 w-full mx-auto"
        >
          {/* Name & Email Row */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
            <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
              <input
                {...register("name")}
                placeholder="Name"
                className="contact-input w-full"
                type="text"
                disabled={isSubmitting}
              />
              {errors.name && (
                <span className="text-red-400 text-sm">{errors.name.message}</span>
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
              <input
                {...register("email")}
                placeholder="Email"
                className="contact-input w-full"
                type="email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="text-red-400 text-sm">{errors.email.message}</span>
              )}
            </motion.div>
          </div>

          {/* Subject */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <input
              {...register("subject")}
              placeholder="Subject"
              className="contact-input w-full"
              type="text"
              disabled={isSubmitting}
            />
            {errors.subject && (
              <span className="text-red-400 text-sm">{errors.subject.message}</span>
            )}
          </motion.div>

          {/* Message */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <textarea
              {...register("message")}
              placeholder="Message"
              className="contact-input w-full min-h-24"
              disabled={isSubmitting}
            />
            {errors.message && (
              <span className="text-red-400 text-sm">{errors.message.message}</span>
            )}
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Alert */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm"
            >
              ✓ Message sent successfully! I&apos;ll get back to you soon.
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black hover:bg-neutral-800 disabled:bg-neutral-400 py-3 px-4 rounded-md text-white font-bold text-lg transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}
