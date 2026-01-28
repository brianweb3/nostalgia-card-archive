import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  cardImageUrl: string;
  proofImageUrl: string;
  cardName: string;
  walletAddress: string;
}

interface VerificationResponse {
  verified: boolean;
  confidence: number;
  reason: string;
  details?: {
    cardMatch: boolean;
    ownershipProof: boolean;
    authenticityScore: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { cardImageUrl, proofImageUrl, cardName, walletAddress }: VerificationRequest = await req.json();

    if (!cardImageUrl || !proofImageUrl) {
      return new Response(
        JSON.stringify({ error: 'Card image and proof image are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔍 Starting AI verification for card:', cardName);

    // Use Lovable AI Gateway for verification
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert trading card authenticator and ownership verifier. Your job is to:
1. Verify that the card shown in the images is authentic (not a fake/proxy)
2. Verify that the proof image shows the same card with proof of ownership (e.g., handwritten note with wallet address, timestamp, etc.)
3. Check for signs of manipulation or editing

Respond in JSON format with:
{
  "verified": boolean,
  "confidence": number (0-100),
  "reason": "brief explanation",
  "details": {
    "cardMatch": boolean (do the images show the same card?),
    "ownershipProof": boolean (is there valid proof of ownership?),
    "authenticityScore": number (0-100, how likely is the card authentic?)
  }
}

Be strict but fair. Look for:
- Matching card details between images
- Clear ownership proof (handwritten note, timestamp, wallet address visible)
- Signs of photo manipulation
- Card condition and authenticity markers`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please verify this trading card ownership claim:
Card Name: ${cardName}
Wallet Address: ${walletAddress}

Image 1: The trading card
Image 2: Proof of ownership (should show same card with handwritten verification)

Analyze both images and determine if:
1. The card appears authentic
2. Both images show the same card
3. The proof image contains valid ownership verification`
              },
              {
                type: 'image_url',
                image_url: { url: cardImageUrl }
              },
              {
                type: 'image_url',
                image_url: { url: proofImageUrl }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1, // Low temperature for consistent results
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI verification failed: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const aiContent = aiResult.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No response from AI');
    }

    console.log('🤖 AI Response:', aiContent);

    // Parse the AI response
    let verificationResult: VerificationResponse;
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verificationResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback: analyze the text response
      const isPositive = aiContent.toLowerCase().includes('verified') || 
                        aiContent.toLowerCase().includes('authentic') ||
                        aiContent.toLowerCase().includes('matches');
      
      verificationResult = {
        verified: isPositive,
        confidence: isPositive ? 70 : 30,
        reason: aiContent.substring(0, 200),
        details: {
          cardMatch: isPositive,
          ownershipProof: isPositive,
          authenticityScore: isPositive ? 70 : 30
        }
      };
    }

    console.log('✅ Verification result:', verificationResult);

    return new Response(
      JSON.stringify(verificationResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Verification error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Verification failed',
        verified: false,
        confidence: 0,
        reason: 'System error during verification'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
