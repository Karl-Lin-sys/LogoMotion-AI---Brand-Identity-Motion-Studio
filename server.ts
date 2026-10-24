import { localApiOnly } from './local-api-guard.mjs';
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const app = express();
app.use('/api', localApiOnly(() => PORT));
const PORT = process.env.PORT || 3000;

// Parse JSON bodies up to 25MB for handling high-resolution 1K/2K/4K images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Shared Gemini SDK client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to strip data URI scheme
function extractBase64(dataUriOrBase64: string): { base64: string; mimeType: string } {
  if (dataUriOrBase64.startsWith('data:')) {
    const matches = dataUriOrBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], base64: matches[2] };
    }
  }
  return { base64: dataUriOrBase64, mimeType: 'image/png' };
}

// 1. Check server health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(apiKey),
  });
});

// 2. Enhance logo prompt using Gemini 3.8 Flash
app.post('/api/enhance-prompt', async (req: Request, res: Response) => {
  try {
    const { companyName, description, industry, style, colors } = req.body;
    if (!description && !companyName) {
      res.status(400).json({ error: 'Company name or description is required.' });
      return;
    }

    const enhancementInstruction = `
You are an award-winning brand identity director and graphic design prompt specialist.
The user wants to generate an iconic, memorable, high-definition company logo.
Company Name: "${companyName || 'Brand'}"
Industry / Field: "${industry || 'General'}"
Visual Style: "${style || 'Modern Minimalist'}"
Color Palette: "${colors || 'Cohesive Brand Colors'}"
Core Concept / Idea: "${description || ''}"

Generate a single, highly effective, visually detailed prompt tailored for the state-of-the-art image generator gemini-3-pro-image-preview.
Guidelines for the prompt:
- Specify vector aesthetic, clean geometry, isolated emblem or wordmark on an uncluttered solid background.
- Focus on clean lines, crisp negative space, balanced proportions, and studio-grade craftsmanship.
- Avoid low-quality artifacts, blurry gradients, clutter, or 3D noise unless specified.
- Keep the prompt under 90 words, direct and descriptive.

Return ONLY the final prompt text without commentary, quotes, or markdown wrappers.
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: enhancementInstruction,
    });

    const enhancedPrompt = response.text?.trim() || description;
    res.json({ enhancedPrompt });
  } catch (error: any) {
    console.error('Enhance prompt error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to enhance prompt',
    });
  }
});

// 3. Generate logo using gemini-3-pro-image-preview
app.post('/api/generate-logo', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      companyName,
      style = 'Minimalist',
      colors = 'Modern Vibrant',
      imageSize = '1K',
      aspectRatio = '1:1',
    } = req.body;

    if (!prompt && !companyName) {
      res.status(400).json({ error: 'Prompt or company name is required.' });
      return;
    }

    // Valid size affordance check: '1K', '2K', '4K'
    const validSizes = ['1K', '2K', '4K'];
    const selectedSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const selectedRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const composedPrompt = `
Professional graphic design company logo for "${companyName || 'Brand'}".
Aesthetic & Style: ${style}.
Color Scheme: ${colors}.
Visual Motif & Details: ${prompt}.
Crisp vector logo design, isolated mark with strong silhouette, elegant typography, perfectly balanced negative space, high contrast, studio presentation, clean background, award-winning branding identity.
`.trim();

    console.log(`Generating logo with gemini-3-pro-image-preview (size: ${selectedSize}, ratio: ${selectedRatio})...`);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: composedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: selectedRatio as any,
          imageSize: selectedSize as any,
        },
      },
    });

    let imageUrl = '';
    let mimeType = 'image/png';

    const candidates = response.candidates || [];
    for (const candidate of candidates) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
      if (imageUrl) break;
    }

    if (!imageUrl) {
      res.status(500).json({
        error: 'No image was returned by the model. Please adjust the prompt and try again.',
      });
      return;
    }

    res.json({
      imageUrl,
      mimeType,
      imageSize: selectedSize,
      aspectRatio: selectedRatio,
      promptUsed: composedPrompt,
    });
  } catch (error: any) {
    console.error('Generate logo error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate logo image.',
    });
  }
});

// 4. Start video animation using veo-3.1-fast-generate-preview
app.post('/api/generate-video', async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      prompt = 'Cinematic logo reveal animation, sleek lighting sweep, 3D depth rotation and glowing particles',
      aspectRatio = '16:9',
      resolution = '720p',
    } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Image base64 data is required to animate the logo.' });
      return;
    }

    // Enforce 16:9 or 9:16 aspect ratio as required by Veo spec
    const validAspectRatios = ['16:9', '9:16'];
    const selectedRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '16:9';

    const validResolutions = ['720p', '1080p'];
    const selectedResolution = validResolutions.includes(resolution) ? resolution : '720p';

    const { base64, mimeType } = extractBase64(imageBase64);

    console.log(`Starting Veo video animation with veo-3.1-fast-generate-preview (aspectRatio: ${selectedRatio}, resolution: ${selectedResolution})...`);

    const motionPrompt = prompt.trim() || 'Cinematic logo motion reveal with smooth 3D rotation, light ray reflection, elegant glowing contours, professional broadcast intro animation';

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: motionPrompt,
      image: {
        imageBytes: base64,
        mimeType: mimeType || 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: selectedResolution as any,
        aspectRatio: selectedRatio as any,
      },
    });

    console.log('Video generation started. Operation name:', operation.name);
    res.json({
      operationName: operation.name,
      aspectRatio: selectedRatio,
      resolution: selectedResolution,
    });
  } catch (error: any) {
    console.error('Generate video error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to initiate video animation.',
    });
  }
});

// 5. Poll video operation status
app.post('/api/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      res.status(400).json({ error: 'Operation name is required.' });
      return;
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: Boolean(updated.done),
      error: updated.error || null,
    });
  } catch (error: any) {
    console.error('Video status error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to retrieve video operation status.',
    });
  }
});

// 6. Download / Stream the generated video
app.get('/api/video-download', async (req: Request, res: Response) => {
  try {
    const operationName = req.query.operationName as string;
    if (!operationName) {
      res.status(400).json({ error: 'Operation name query parameter is required.' });
      return;
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });

    if (!updated.done) {
      res.status(400).json({ error: 'Video generation is still in progress.' });
      return;
    }

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      res.status(404).json({ error: 'Video URI not found in operation response.' });
      return;
    }

    console.log('Fetching generated video from URI with API key...');
    const videoRes = await fetch(uri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!videoRes.ok) {
      res.status(videoRes.status).json({
        error: `Failed to download video stream: ${videoRes.statusText}`,
      });
      return;
    }

    const arrayBuf = await videoRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', buffer.length.toString());
    res.setHeader('Content-Disposition', 'inline; filename="animated-logo.mp4"');
    res.send(buffer);
  } catch (error: any) {
    console.error('Video download error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to download video.',
    });
  }
});

// Vite middleware for dev or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '127.0.0.1', () => {
    console.log(`LogoMotion server listening on port ${PORT}`);
  });
}

startServer();
