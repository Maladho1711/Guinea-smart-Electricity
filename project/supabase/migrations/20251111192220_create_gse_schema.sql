/*
  # Création du schéma Guinea Smart Electricity (GSE)

  1. Nouvelles Tables
    - `profiles`
      - `id` (uuid, clé primaire, lié à auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text: 'client', 'technicien', 'manager')
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tickets`
      - `id` (uuid, clé primaire)
      - `client_id` (uuid, référence vers profiles)
      - `technicien_id` (uuid, référence vers profiles, nullable)
      - `title` (text)
      - `description` (text)
      - `status` (text: 'nouveau', 'en_cours', 'resolu')
      - `priority` (text: 'basse', 'moyenne', 'haute', 'critique')
      - `latitude` (numeric, nullable)
      - `longitude` (numeric, nullable)
      - `address` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `resolved_at` (timestamptz, nullable)
    
    - `payments`
      - `id` (uuid, clé primaire)
      - `client_id` (uuid, référence vers profiles)
      - `amount` (numeric)
      - `status` (text: 'en_attente', 'complete', 'echoue')
      - `payment_method` (text)
      - `transaction_id` (text, unique, nullable)
      - `description` (text)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)
    
    - `invoices`
      - `id` (uuid, clé primaire)
      - `client_id` (uuid, référence vers profiles)
      - `amount` (numeric)
      - `period` (text)
      - `consumption_kwh` (numeric)
      - `status` (text: 'impayee', 'payee', 'en_retard')
      - `due_date` (timestamptz)
      - `paid_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
    
    - `chat_messages`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers profiles)
      - `message` (text)
      - `is_bot` (boolean)
      - `created_at` (timestamptz)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques pour chaque rôle (client, technicien, manager)
    - Les clients peuvent voir leurs propres données
    - Les techniciens peuvent voir et modifier les tickets
    - Les managers ont accès complet en lecture
*/

-- Création de la table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('client', 'technicien', 'manager')),
  phone text DEFAULT '',
  address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Les managers peuvent voir tous les profils"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
    )
  );

-- Création de la table tickets
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  technicien_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'resolu')),
  priority text NOT NULL DEFAULT 'moyenne' CHECK (priority IN ('basse', 'moyenne', 'haute', 'critique')),
  latitude numeric,
  longitude numeric,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les clients peuvent voir leurs propres tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Les clients peuvent créer des tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Les techniciens peuvent voir tous les tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('technicien', 'manager')
    )
  );

CREATE POLICY "Les techniciens peuvent mettre à jour les tickets"
  ON tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('technicien', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('technicien', 'manager')
    )
  );

-- Création de la table payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'complete', 'echoue')),
  payment_method text NOT NULL,
  transaction_id text UNIQUE,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les clients peuvent voir leurs propres paiements"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Les clients peuvent créer des paiements"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Les managers peuvent voir tous les paiements"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
    )
  );

-- Création de la table invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  period text NOT NULL,
  consumption_kwh numeric NOT NULL CHECK (consumption_kwh >= 0),
  status text NOT NULL DEFAULT 'impayee' CHECK (status IN ('impayee', 'payee', 'en_retard')),
  due_date timestamptz NOT NULL,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les clients peuvent voir leurs propres factures"
  ON invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Les managers peuvent voir toutes les factures"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
    )
  );

CREATE POLICY "Le système peut créer des factures"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
    )
  );

-- Création de la table chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_bot boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leurs propres messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer des messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_technicien_id ON tickets(technicien_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();