import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import {
  submitDocFeedback,
  getDocFeedbackStats,
  getAllFeedbacks,
  localCreateNotification,
} from '@server/lib/db';

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const body = req.body;
    const { slug, rating, comment, feedbackId } = body;

    if (!slug || !rating || !['helpful', 'unhelpful'].includes(rating)) {
      return jsonReply(
        expressResponse,
        { error: "Slug and valid rating ('helpful' | 'unhelpful') are required." },
        { status: 400 },
      );
    }

    const ip = req.get('x-forwarded-for') || req.get('x-real-ip') || 'unknown';
    const ipHash = Buffer.from(ip).toString('base64').substring(0, 10);

    const feedback = await submitDocFeedback(slug, rating, comment, ipHash, feedbackId);
    const stats = await getDocFeedbackStats(slug);

    // Emit live notification in Admin Notification Hub
    try {
      if (comment) {
        localCreateNotification({
          isGlobal: true,
          title: `Sugestie / Comentariu Feedback pe /docs/${slug}`,
          message: `Un jucător a lăsat o sugestie: "${comment.slice(0, 140)}${comment.length > 140 ? '...' : ''}" (Vot: ${rating === 'helpful' ? 'Util' : 'Neutru/Incomplet'})`,
          category: 'feedback',
          severity: rating === 'unhelpful' ? 'warning' : 'info',
          link: `/docs/${slug}`,
          metadata: { slug, rating, comment, stats },
        });
      } else if (rating === 'unhelpful') {
        localCreateNotification({
          isGlobal: true,
          title: `Feedback Negativ pe /docs/${slug}`,
          message: `Un jucător a marcat ghidul ca nefiind util. Scorul actual de satisfacție este ${stats.percentage}% (${stats.helpful} Da / ${stats.unhelpful} Nu).`,
          category: 'feedback',
          severity: 'warning',
          link: `/docs/${slug}`,
          metadata: { slug, rating, stats },
        });
      } else if (rating === 'helpful') {
        localCreateNotification({
          isGlobal: true,
          title: `Feedback Pozitiv pe /docs/${slug}`,
          message: `Un jucător a marcat ghidul ca util! Scorul curent de satisfacție este ${stats.percentage}% (${stats.helpful} voturi pozitive).`,
          category: 'feedback',
          severity: 'success',
          link: `/docs/${slug}`,
          metadata: { slug, rating, stats },
        });
      }
    } catch (notifErr) {
      console.error('[Feedback Notification] Failed to create notification:', notifErr);
    }

    return jsonReply(expressResponse, { success: true, feedback, stats });
  } catch (err: any) {
    console.error('[API Docs Feedback POST] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to submit feedback' }, { status: 500 });
  }
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const stats = await getDocFeedbackStats(slug);
      return jsonReply(expressResponse, { success: true, stats });
    }

    const feedbacks = await getAllFeedbacks();
    return jsonReply(expressResponse, { success: true, total: feedbacks.length, feedbacks });
  } catch (err: any) {
    console.error('[API Docs Feedback GET] Error:', err);
    return jsonReply(expressResponse, { error: 'Failed to fetch feedback' }, { status: 500 });
  }
}
