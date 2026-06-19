/**
 * Unit tests — Zod validation schema
 *
 * These run in pure Node, no server required.
 * Run: npm test
 */

import { contactFormSchema } from "../../lib/validation";

describe("contactFormSchema", () => {
  // --- Valid data ---

  test("accepts a fully valid submission", () => {
    const result = contactFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      subject: "Hello there",
      message: "This is a valid message body.",
    });
    expect(result.success).toBe(true);
  });

  test("trims whitespace from all fields", () => {
    const result = contactFormSchema.safeParse({
      name: "  John  ",
      email: "  john@example.com  ",
      subject: "  Hello  ",
      message: "  Hello message here  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("John");
      expect(result.data.email).toBe("john@example.com");
      expect(result.data.subject).toBe("Hello");
      expect(result.data.message).toBe("Hello message here");
    }
  });

  // --- Name field ---

  test("rejects name shorter than 2 characters", () => {
    const result = contactFormSchema.safeParse({
      name: "J",
      email: "john@example.com",
      subject: "Hello there",
      message: "This is a valid message.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  test("rejects name longer than 100 characters", () => {
    const result = contactFormSchema.safeParse({
      name: "J".repeat(101),
      email: "john@example.com",
      subject: "Hello there",
      message: "This is a valid message.",
    });
    expect(result.success).toBe(false);
  });

  test("accepts name exactly at min boundary (2 chars)", () => {
    const result = contactFormSchema.safeParse({
      name: "Jo",
      email: "john@example.com",
      subject: "Hello there",
      message: "This is a valid message.",
    });
    expect(result.success).toBe(true);
  });

  // --- Email field ---

  test("rejects malformed email", () => {
    const badEmails = [
      "notanemail",
      "@nodomain",
      "no@",
      "spaces in@email.com",
    ];
    for (const email of badEmails) {
      const result = contactFormSchema.safeParse({
        name: "John",
        email,
        subject: "Hello there",
        message: "Valid message body here.",
      });
      expect(result.success).toBe(false);
    }
  });

  test("rejects email longer than 255 characters", () => {
    const longEmail = "a".repeat(246) + "@b.com"; // 253 chars but over 255 total
    const result = contactFormSchema.safeParse({
      name: "John",
      email: "a".repeat(250) + "@b.com",
      subject: "Hello there",
      message: "Valid message body here.",
    });
    expect(result.success).toBe(false);
  });

  // --- Subject field ---

  test("rejects subject shorter than 5 characters", () => {
    const result = contactFormSchema.safeParse({
      name: "John",
      email: "john@example.com",
      subject: "Hi",
      message: "Valid message body here.",
    });
    expect(result.success).toBe(false);
  });

  test("rejects subject longer than 200 characters", () => {
    const result = contactFormSchema.safeParse({
      name: "John",
      email: "john@example.com",
      subject: "S".repeat(201),
      message: "Valid message body here.",
    });
    expect(result.success).toBe(false);
  });

  // --- Message field ---

  test("rejects message shorter than 10 characters", () => {
    const result = contactFormSchema.safeParse({
      name: "John",
      email: "john@example.com",
      subject: "Hello there",
      message: "Short",
    });
    expect(result.success).toBe(false);
  });

  test("rejects message longer than 5000 characters", () => {
    const result = contactFormSchema.safeParse({
      name: "John",
      email: "john@example.com",
      subject: "Hello there",
      message: "M".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  test("accepts message exactly at max boundary (5000 chars)", () => {
    const result = contactFormSchema.safeParse({
      name: "John",
      email: "john@example.com",
      subject: "Hello there",
      message: "M".repeat(5000),
    });
    expect(result.success).toBe(true);
  });

  // --- Missing fields ---

  test("rejects missing name", () => {
    const result = contactFormSchema.safeParse({
      email: "john@example.com",
      subject: "Hello there",
      message: "Valid message body here.",
    });
    expect(result.success).toBe(false);
  });

  test("rejects missing email", () => {
    const result = contactFormSchema.safeParse({
      name: "John",
      subject: "Hello there",
      message: "Valid message body here.",
    });
    expect(result.success).toBe(false);
  });

  test("rejects empty object", () => {
    const result = contactFormSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  test("rejects null body", () => {
    const result = contactFormSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  test("rejects array instead of object", () => {
    const result = contactFormSchema.safeParse([]);
    expect(result.success).toBe(false);
  });
});
