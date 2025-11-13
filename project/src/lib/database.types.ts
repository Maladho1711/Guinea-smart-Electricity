export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'client' | 'technicien' | 'manager'
          phone: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'client' | 'technicien' | 'manager'
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'client' | 'technicien' | 'manager'
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          client_id: string
          technicien_id: string | null
          title: string
          description: string
          status: 'nouveau' | 'en_cours' | 'resolu'
          priority: 'basse' | 'moyenne' | 'haute' | 'critique'
          latitude: number | null
          longitude: number | null
          address: string
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          client_id: string
          technicien_id?: string | null
          title: string
          description: string
          status?: 'nouveau' | 'en_cours' | 'resolu'
          priority?: 'basse' | 'moyenne' | 'haute' | 'critique'
          latitude?: number | null
          longitude?: number | null
          address: string
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          technicien_id?: string | null
          title?: string
          description?: string
          status?: 'nouveau' | 'en_cours' | 'resolu'
          priority?: 'basse' | 'moyenne' | 'haute' | 'critique'
          latitude?: number | null
          longitude?: number | null
          address?: string
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          client_id: string
          amount: number
          status: 'en_attente' | 'complete' | 'echoue'
          payment_method: string
          transaction_id: string | null
          description: string
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          client_id: string
          amount: number
          status?: 'en_attente' | 'complete' | 'echoue'
          payment_method: string
          transaction_id?: string | null
          description: string
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          amount?: number
          status?: 'en_attente' | 'complete' | 'echoue'
          payment_method?: string
          transaction_id?: string | null
          description?: string
          created_at?: string
          completed_at?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          client_id: string
          amount: number
          period: string
          consumption_kwh: number
          status: 'impayee' | 'payee' | 'en_retard'
          due_date: string
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          amount: number
          period: string
          consumption_kwh: number
          status?: 'impayee' | 'payee' | 'en_retard'
          due_date: string
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          amount?: number
          period?: string
          consumption_kwh?: number
          status?: 'impayee' | 'payee' | 'en_retard'
          due_date?: string
          paid_at?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          message: string
          is_bot: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          is_bot?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          is_bot?: boolean
          created_at?: string
        }
      }
    }
  }
}
