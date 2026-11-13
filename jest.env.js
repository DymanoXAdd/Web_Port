// lib/email.ts builds a Resend client at import; unit tests never send mail, so a dummy key is enough.
process.env.RESEND_API_KEY ??= "re_test_dummy";
