import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Simple rate limiting store (in production, use Redis or database)
const rateLimitMap = new Map<string, number[]>();
const emailRateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per 15 minutes per IP
const EMAIL_RATE_LIMIT_MAX_REQUESTS = 2; // 2 requests per 15 minutes per email

function htmlEscape(str: string): string {
  return str.replace(/[<>&"']/g, (match) => {
    const escapeMap: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return escapeMap[match];
  });
}

function getRateLimitKey(request: NextRequest): string {
  // Get IP from headers for proper per-IP rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  // Use the first IP from x-forwarded-for if available
  if (forwarded) {
    return `ip:${forwarded.split(',')[0].trim()}`;
  }
  
  // Use x-real-ip if available
  if (realIp) {
    return `ip:${realIp}`;
  }
  
  // Fallback for development
  return 'ip:localhost';
}

function isRateLimited(key: string, isEmail: boolean = false): boolean {
  const now = Date.now();
  const map = isEmail ? emailRateLimitMap : rateLimitMap;
  const maxRequests = isEmail ? EMAIL_RATE_LIMIT_MAX_REQUESTS : RATE_LIMIT_MAX_REQUESTS;
  const requests = map.get(key) || [];
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= maxRequests) {
    return true;
  }
  
  // Add current request and update map
  validRequests.push(now);
  map.set(key, validRequests);
  
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - check both IP and email
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests from this IP. Please try again later.' },
        { status: 429 }
      );
    }

    // Check content length (max 10KB) - require Content-Length header
    const contentLength = request.headers.get('content-length');
    if (!contentLength) {
      return NextResponse.json(
        { error: 'Content-Length header required' },
        { status: 400 }
      );
    }
    
    if (parseInt(contentLength) > 10240) {
      return NextResponse.json(
        { error: 'Message too large (max 10KB)' },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { name, email, message, honeypot } = body;

    // Honeypot check (bot protection)
    if (honeypot) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 100 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Field too long' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Per-email rate limiting
    const emailKey = `email:${email.toLowerCase()}`;
    if (isRateLimited(emailKey, true)) {
      return NextResponse.json(
        { error: 'Too many messages from this email. Please try again later.' },
        { status: 429 }
      );
    }

    // Get recipient from environment variable (required in production)
    const recipient = process.env.CONTACT_EMAIL;
    if (!recipient) {
      console.error('CONTACT_EMAIL environment variable not set');
      return NextResponse.json(
        { error: 'Email service not configured properly' },
        { status: 503 }
      );
    }

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    // Verify SMTP configuration
    if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    // Send email using nodemailer
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SENDER_EMAIL}>`,
      to: recipient,
      subject: `Portfolio Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Portfolio Contact Form Submission</h3>
        <p><strong>Name:</strong> ${htmlEscape(name)}</p>
        <p><strong>Email:</strong> ${htmlEscape(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${htmlEscape(message).replace(/\n/g, '<br>')}</p>
      `
    });

    return NextResponse.json({
      message: "Message sent successfully! I'll get back to you soon."
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}