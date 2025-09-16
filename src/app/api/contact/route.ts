import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../../utils/replitmail';

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
  // For Replit environment, use a simple fallback approach
  // In production, consider using a more robust IP detection
  return 'rate-limit-key'; // Single rate limit for all users
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
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
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

    // Get recipient from environment variable (required)
    const recipient = process.env.CONTACT_EMAIL;
    if (!recipient) {
      console.error('CONTACT_EMAIL environment variable not set');
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 503 }
      );
    }

    // Send email using Replit Mail
    await sendEmail({
      to: recipient,
      subject: `Portfolio Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Portfolio Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
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