import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { recordAiFeedback } from '@server/lib/security/aiTelemetry';

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const body = req.body;
    const { interactionId, querySnippet, feedback, reason } = body || {};

    if (feedback !== 'helpful' && feedback !== 'unhelpful') {
      return jsonReply(
        expressResponse,
        {
          success: false,
          error: "Tipul de feedback este invalid. Sunt acceptate doar 'helpful' sau 'unhelpful'.",
        },
        { status: 400 },
      );
    }

    const result = recordAiFeedback({
      interactionId: typeof interactionId === 'string' ? interactionId : undefined,
      querySnippet: typeof querySnippet === 'string' ? querySnippet : undefined,
      feedback,
      reason: typeof reason === 'string' ? reason : undefined,
    });

    return jsonReply(expressResponse, result);
  } catch (error: any) {
    console.error('[AI Feedback] Error processing feedback:', error);
    return jsonReply(
      expressResponse,
      {
        success: false,
        error: 'A apărut o problemă internă la înregistrarea evaluării.',
      },
      { status: 500 },
    );
  }
}
