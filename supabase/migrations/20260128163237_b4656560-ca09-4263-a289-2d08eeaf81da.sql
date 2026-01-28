-- Create enum for token status
CREATE TYPE public.token_status AS ENUM ('pending', 'verified', 'launched', 'rejected');

-- Create enum for rarity
CREATE TYPE public.token_rarity AS ENUM ('common', 'uncommon', 'rare', 'ultra', 'legendary');

-- Create tokens table
CREATE TABLE public.tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rarity token_rarity NOT NULL DEFAULT 'common',
  status token_status NOT NULL DEFAULT 'pending',
  market_cap DECIMAL(20, 2) DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verifications table
CREATE TABLE public.verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id UUID REFERENCES public.tokens(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT NOT NULL,
  ai_confidence DECIMAL(5, 2) CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  verified_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wallet_connections table to track connected wallets
CREATE TABLE public.wallet_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  wallet_type TEXT NOT NULL DEFAULT 'phantom',
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_connections ENABLE ROW LEVEL SECURITY;

-- Tokens policies (public read, wallet-based write)
CREATE POLICY "Anyone can view tokens" 
ON public.tokens FOR SELECT USING (true);

CREATE POLICY "Wallet owners can create tokens" 
ON public.tokens FOR INSERT WITH CHECK (true);

CREATE POLICY "Wallet owners can update their tokens" 
ON public.tokens FOR UPDATE USING (true);

-- Verifications policies
CREATE POLICY "Anyone can view verifications" 
ON public.verifications FOR SELECT USING (true);

CREATE POLICY "System can create verifications" 
ON public.verifications FOR INSERT WITH CHECK (true);

-- Wallet connections policies
CREATE POLICY "Anyone can view wallet connections" 
ON public.wallet_connections FOR SELECT USING (true);

CREATE POLICY "Anyone can create wallet connection" 
ON public.wallet_connections FOR INSERT WITH CHECK (true);

CREATE POLICY "Wallet owners can update their connection" 
ON public.wallet_connections FOR UPDATE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tokens_updated_at
BEFORE UPDATE ON public.tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();